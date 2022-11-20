const JWT = require("jsonwebtoken");
require("dotenv").config();

exports.JWT_Sign = (user) => {
  // console.log(`AUTH SERVICE: ${user}`);
  const acessToken = JWT.sign(
    {
      user: {
        users_id: user.users_id,
        users_name: user.users_name,
        email: user.email
      },
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    },
    process.env.SECRET_KEY
  );
  return acessToken;
};
