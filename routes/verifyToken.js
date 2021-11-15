const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = (req, res, next) => {
  //get token from header
  const authHeader = req.headers.token;
  //verify token
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json("Token is invalid");
      req.user = user;
      next();
    });
  } else {
    return res.status(403).json("No token found.");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.admin) {
      next();
    } else {
      res.status(403).json("You are not authorized to do this action");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.admin) {
      next();
    } else {
      res.status(403).json("You are not authorized to do this action");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
