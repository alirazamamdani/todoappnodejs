const jwt = require("jsonwebtoken");

const middlewares = {
  authMiddleware: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const isUserAuthorize = jwt.verify(token, "authapp");
      if (isUserAuthorize._doc) {
        next();
      } else {
        res.json({
          message: "user not authorized",
        });
      }
    } catch (error) {
      res.json({
        message: "user not authroized"
      });
    }
  },
};

module.exports = middlewares;
