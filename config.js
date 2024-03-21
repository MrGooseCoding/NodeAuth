const config = {
    dbPath: 'database.db',
    appName: 'NodeAuth',

    validation_email: {
        subject: `Email Validation at %s`,
        text: `Hi %s,
Thank you for registering on our website. To complete the registration process, please click on the following link to validate your email address:

%s

If you didn't register on our website, please ignore this email.
`
    }
}

module.exports = config