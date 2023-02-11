const { verify } = require("jsonwebtoken");

const validateUserToken = (req, res, next) => {
  // const {UserToken}=(req.cookies)
  const accessToken = req.header("UserToken");
  if (!UserToken) return res.json({ error: "User not logged in" });
  else{
  try {
    const validateUserToken = verify(UserToken, "importantsecret");
    req.user=validateUserToken
    if (validateUserToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
    }
};



module.exports =  validateUserToken ;