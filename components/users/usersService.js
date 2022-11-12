const { models } = require('../../models')
const { sequelize } = require('../../models/index')
const bcrypt = require('bcrypt')

exports.getUsers = async () => {
    const result = await models.users.findAll({
        raw: true
    });

    return result
}


exports.checkUsers = async (email) => {


    const result = await models.users.findOne({
        attributes: ['users_id', 'users_name', 'email'],
        where: { email: email },
        raw: true
    });

    return result;
}

exports.registerUsers = async (users_name, email, password) => {

    await sequelize
        .query('call sp_addidusers()',
            {})
        .then(v => console.log(v));

    const user = await models.users.findOne({
        attributes: ['users_id'],
        where: { users_password: null },
        raw: true
    })

    const userID = user.users_id;
    const hashPass = await bcrypt.hash(password, 10)
    const query_update = `update users set users_name = '${users_name}', email = '${email}', users_password = '${hashPass}' where users_id = '${userID}'`;
    await sequelize
        .query(query_update,
            {})
        .then(v => console.log(v));

    const new_user = await models.users.findOne({
        attributes: ['users_id', 'users_name', 'email'],
        where: { users_id: userID },
        raw: true
    })
    return {
        is_success: true,
        user: new_user
    }
}