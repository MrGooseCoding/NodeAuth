const User = require('./../models/user')

function api (url, fun, router, model) {
    router.post(url, (req, res) => {
        const v = new model.validator(req.body)
    
        v.format_data().then(async () => {
            const user = new User()
            
            if (v.not_null("token")) {
                const data = await User.objects_getBy("token", v.data.token)
                user.setData(data[1])
            }
            fun(req, res, v, user)
        })
    })
}

module.exports = api