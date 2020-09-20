class Imap {
  constructor (config, notifier) {
    this.notifier = notifier
    this.config = config
  }

  onMail (handler) {
    this.handler = handler
  }

  start () {
    this.notifier({
      ...this.config,
      tlsOptions: { rejectUnauthorized: false }
    })
      .on('mail', this.handler)
      .start()
  }
}

module.exports = Imap
