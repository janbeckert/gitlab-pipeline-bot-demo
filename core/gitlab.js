class Gitlab {
  constructor (gitlabService) {
    this.gitlabService = gitlabService
  }

  populateIssueMappings (projectId, issueMapping) {
    return new Promise((resolve, reject) => {
      this.gitlabService.getAllIssues(projectId)
        .then(issues => {
          const promises = []
          issues.forEach(issue => {
            promises.push(new Promise((resolve, reject) => {
              this.gitlabService.getFirstNote(projectId, issue.iid)
                .then(note => {
                  const regex = /`{3}((\n|.)*)`{3}/
                  const matches = regex.exec(note.body)
                  if (matches.length > 0) {
                    issueMapping.addMapping(issue.iid, JSON.parse(matches[1]).emails[0])
                  }
                  resolve()
                })
                .catch(() => {
                  resolve()
                })
            }))
          })
          Promise.all(promises).then(resolve).catch(reject)
        })
    })
  }

  createIssue (projectId, issueTopic, issueDescription, leadName, leadMail) {
    return new Promise((resolve, reject) => {
      this.gitlabService.createIssue(projectId, {
        title: issueTopic + ' - ' + leadName,
        description: 'New lead from ' + leadName + ' (' + leadMail + ')' + '\n\n' + issueDescription
      })
        .then(resolve, reject)
    })
  }

  createMailNote (projectId, issueId, mailSender, mailContent) {
    return new Promise((resolve, reject) => {
      this.gitlabService.createNote(projectId, issueId, {
        body: 'New mail from ' + mailSender + ': \n\n' + mailContent
      })
    })
  }

  createDataNote (projectId, issueId, data) {
    return new Promise((resolve, reject) => {
      this.gitlabService.createNote(projectId, issueId, {
        body: `
<details><summary></summary>
<p>

\`\`\`
` + JSON.stringify(data) + `
\`\`\`

</p>
</details>`
      })
    })
  }
}

module.exports = Gitlab
