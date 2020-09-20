# Gitlab Pipeline Bot Demo

## Code Status
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Overview
Lead message bot creates an automated process for sharing customer communication artifacts on a sales pipeline board. The sales pipeline is build using gitlabs issue boards and the customer communication is using email.

The aim of this project lies in simplifing sharing of customer communication within the team while still providing sufficient privacy (messages have to be forwarded manually) and reducing noise (only relevant messages are pinned to the issues).

## Installation

Gitlab prerequisites:
1. create a new repository/project
2. set up a basic issue board to represent your sales pipeline
3. create a new gitlab user for the board, add the user to the project and grant at least reporter-level rights
4. create a personal token for the user

create a configuration file named ```config.js``` with the following contents:

```
module.exports = {
  GITLAB_TOKEN: '',
  GITLAB_HOST: 'https://gitlab.example.com/api/v4/',
  mail: {
    user: 'IMAP-User',
    password: 'Imap-Password',
    host: 'imap.example.com',
    port: 993,
    tls: true
  },
  initialLeadsMail: 'info@example.com',
  forwardMail: 'leadmessage@example.com',
  projectId: 42
}
```

install dependencies:
```
npm install
```

## Usage

```
npm start
```

_Note: the tool will only pick up emails while running._

Now you can start to send some mails:
- (as a customer) send a mail to the ```initialLeadsMail``` as configured in the ```config.js``` file.
  - The bot will create a new issue on the board containing the topic (using the subject), customer name & email, and the contents of the mail send
- forward a mail from a customer using your email softwares forward function to the ```forwardMail``` as configured in the ```config.js``` file
  - The bot will find the issue corresponding to the customer email address and add a note containing the mail you've forwarded

## Limitations

Currently, the tool only watches one inbox so you have to make sure that both emails addressed to the ```initialLeadsMail``` and the ```forwardMail``` will appear in the inbox defined in the config file (e.g. using automated forwarding).
