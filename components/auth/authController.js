const authService = require("./authService");

exports.login = async (req, res) => {
    const result = authService.JWT_Sign(req.user);
    res.status(201).json(result)
}

exports.getProfile = async (req, res) => {
    const user = {
        users_id: req.user.users_id,
        users_name: req.user.users_name,
        email: req.user.email
    };
    res.status(200).json(user)
}