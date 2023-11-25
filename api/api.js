const User = require('./../models/user')

function api (url, fun, router, model, tokenRequired = false) {
    router.post(url, (req, res) => {
        const v = new model.validator(req.body)
    
        v.format_data().then(async () => {
            const user = new User()
            
            if (v.not_null("token")) {
                const data = await User.objects_getBy("token", v.data.token)
                
                if (data[0]) {
                    user.setData(data[1])
                    
                } else if (tokenRequired) {
                    res.status(400).json(data[1])
                    return
                }
            }
            fun(req, res, v, user)
        })
    })
}

module.exports = api