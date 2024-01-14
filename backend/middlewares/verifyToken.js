const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(400).json("アクセストークンが含まれていません。");
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(400).json("アクセストークンが有効ではありません。");
    }
    next();
  });
};

module.exports = { verifyToken };