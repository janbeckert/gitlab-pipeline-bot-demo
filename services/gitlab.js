class Gitlab {
  constructor (host, authToken) {
    this.request = require('request')
    this.host = host
    this.authToken = authToken
  }

  sendRequest (method, endpoint, qs = {}, body = null) {
    return new Promise((resolve, reject) => {
      let req
      if (method === 'post') {
        req = this.request.post
      } else if (method === 'get') {
        req = this.request.get
      } else {
        return
      }

      let requestData = {
        qs: {
          private_token: this.authToken,
          ...qs
        }
      }
      if (body !== null) {
        requestData = {
          ...requestData,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }
      }

      req(this.host + endpoint, requestData,
        function (error, response, body) {
          if (error || response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(error + response.statusCode))
          }
          resolve(JSON.parse(body))
        })
    })
  }

  async getAllIssues (projectId) {
    return this.sendRequest('get', 'projects/' + projectId + '/issues')
  }

  async getFirstNote (projectId, issueId) {
    const notes = await this.sendRequest('get',
      'projects/' + projectId + '/issues/' + issueId + '/notes',
      {
        sort: 'asc',
        order_by: 'created_at',
        per_page: 1
      }
    )
    if (notes.length < 1) {
      throw new Error('no notes found')
    } else {
      return notes[0]
    }
  }

  async createNote (projectId, issueId, note) {
    return this.sendRequest('post',
      'projects/' + projectId + '/issues/' + issueId + '/notes',
      {},
      note
    )
  }

  async createIssue (projectId, issue) {
    const createdIssue = await this.sendRequest('post',
      'projects/' + projectId + '/issues',
      {},
      issue)

    if (createdIssue.iid !== undefined) {
      return createdIssue.iid
    } else {
      throw new Error('could not create issue')
    }
  }
}

module.exports = Gitlab
