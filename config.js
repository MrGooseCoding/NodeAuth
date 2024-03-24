const config = {
    dbPath: 'database.db',
    appName: 'NodeAuth',

    validation_email: {
        subject: `Email Validation at %s`,
        text: `Hi %s,
Thank you for registering on our website. :

%s

If you didn't register on our website, please ignore this email.

Thanks,
%s Team`
    }
}

module.exports = config