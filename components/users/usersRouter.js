var express = require('express');
var router = express.Router();
const usersController = require('./usersController')

/* GET users listing. */
router.get('/', usersController.getUser);

router.post('/', usersController.registerUser);

module.exports = router;
