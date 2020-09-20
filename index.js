const CONFIG = require('./config.js')

// read store from gitlab
const GitlabService = require('./services/gitlab.js')
const gitlabService = new GitlabService(CONFIG.GITLAB_HOST, CONFIG.GITLAB_TOKEN)
const Gitlab = require('./core/gitlab.js')
const gitlab = new Gitlab(gitlabService)
const IssueMapping = require('./core/issueMapping.js')
const issueMapping = new IssueMapping()

const Imap = require('./services/imap.js')
const imap = new Imap(CONFIG.mail, require('mail-notifier'))

const MailHandler = require('./core/mailHandler.js')
const mailHandler = new MailHandler(
  CONFIG.initialLeadsMail,
  CONFIG.forwardMail,
  // handle initial mails
  mail => {
    // 1 > (extact and) generate issue text from mail
    if (mail.from.length < 1) {
      return
    }

    // 2 > post issue on gitlab
    gitlab.createIssue(
      CONFIG.projectId,
      mail.subject,
      mail.text,
      mail.from[0].name,
      mail.from[0].address
    )
      .then(issueId => {
        // 3 > add new mail address to issueMapping obj
        issueMapping.addMapping(issueId, mail.from[0].address)
        // 3 > add inital note to issue containing encoded issueMapping
        return gitlab.createDataNote(CONFIG.projectId, issueId, {
          emails: [mail.from[0].address]
        })
      })
  },
  // handle lead mails
  mail => {
    // figure out which issue to use:
    // 1 > extract original recipient from forwarded mail
    var re = new RegExp(/(.*)Von(.*)<(.*)>/)
    var findings = re.exec(mail.text)
    if (!findings) {
      return
    }
    var recipient = findings[3]

    // 2 > find appropriate issue using issueMapping obj
    var issues = issueMapping.findIssues(recipient)
    if (issues.length < 1) {
      return
    }
    var issueIid = issues[0]
    // 3 > (extract and) generate message to post in gitlab

    // 4 > post message on gitlab
    return gitlab.createMailNote(
      CONFIG.projectId,
      issueIid,
      recipient,
      mail.text
    )
  }
)
imap.onMail((mail) => mailHandler.handleMail(mail))

gitlab.populateIssueMappings(CONFIG.projectId, issueMapping)
  .then(() => {
    imap.start()
  })
