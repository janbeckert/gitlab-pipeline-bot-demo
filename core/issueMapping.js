class IssueMapping {
  constructor () {
    this.mappings = []
  }

  addMapping (issueId, email) {
    this.mappings.push({
      issueId: issueId,
      email: email
    })
  }

  findIssues (email) {
    return this.mappings
      .filter((mapping) => {
        return mapping.email.toUpperCase() === email.toUpperCase()
      })
      .map(mapping => mapping.issueId)
  }
}

module.exports = IssueMapping
