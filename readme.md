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

Now, navigate to `config.js`. In it, you will find some setting options. You may change them as you wish. If you want to use email authentication, continue the instalation process and then click [here](#Add-email-authentication-(optional))

It's time to download our dependencies. To do so, simply run:

```bash
npm install
```

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