const jwt = require("jsonwebtoken");
const jstConfing = require("../config/jwt");

function mustBeLoggedIn(req, res, next) {
  if (!req.cookies.token) {
    res.status(401).send("you are not login");
    return;
  }

  try {
    const paylod = jwt.verify(req.cookies.token, jwtConfing.secret);

    req.user = paylod;

    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
    return;
  }
}

module.exports = mustBeLoggedIn;
