# NodeAuth
An intermediate-level user authentication structure for nodejs

## Instalation
Nodejs is required. If you already have node installed, continue with the tutorial.

First, clone the package like below:
```bash
git clone git@github.com:MrGooseCoding/NodeAuth.git
```

Then, you must create a `private-config.js` file on the root directory. In it, paste the following code.

```js
const private_config = {}
private_config.EMAIL = ""
private_config.PASSWORD = ""
private_config.CLIENT_ID = ""
private_config.CLIENT_SECRET = ""
private_config.REFRESH_TOKEN = ""
module.exports=private_config
```

We'll leave it like that for now.

Now, navigate to `config.js`. In it, you will find some setting options. You may change them as you wish. If you want to use email verification, continue the instalation process and then click [here](#Add-email-authentication-optional)

It's time to download our dependencies. To do so, simply run:

```
npm install
```

Now for the final part, setting up the database. To do so, create a `database.db` file in the root directory and create tables in it using the schemas provided in `users.sql` and `validation.sql`  

Our project is all set!

You can run it in two ways

**Dev mode**
```
npm start
```

**Production / other**
```
node app.js
```

### Add email authentication (optional)
Our package offers the possibility of an email verification through an email sent to the user's inbox with a 6-digit code. This requires google's gmail api. To use it, follow [this article](https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/#google-cloud-platform-configurations), until the "Back to the Server" section. Credentials must be inputed in the `private-config.js` file for it to work. Then, change the `validate_email` property on `config.js` to `true`. The rest is done for you.

