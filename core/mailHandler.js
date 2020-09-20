class MailHandler {
  constructor (initAddress, leadAddress, initMailHandler, leadMailHandler) {
    this.initAddress = initAddress
    this.leadAddress = leadAddress
    this.initMailHandler = initMailHandler
    this.leadMailHandler = leadMailHandler
  }

  handleMail (mail) {
    const address = this.getRecieverAddress(mail)
    if (address !== false) {
      if (address.isInit) {
        this.initMailHandler(mail)
      } else if (address.isLead) {
        this.leadMailHandler(mail)
      }
    }
  }

  getRecieverAddress (mail) {
    const receipients = mail.to.map(obj => obj.address.toUpperCase())
    for (const i in receipients) {
      switch (receipients[i]) {
        case this.initAddress.toUpperCase():
          return { isInit: true, isLead: false }
        case this.leadAddress.toUpperCase():
          return { isInit: false, isLead: true }
      }
    }
    return false
  }
}

module.exports = MailHandler
