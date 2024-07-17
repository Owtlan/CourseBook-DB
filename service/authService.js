const User = require('../models/User')
const bcrypt = require('bcrypt')


const register = (username, password) => {

    let user = new User({ username, password })

    return user.save()

}



module.exports = {
    register,
}