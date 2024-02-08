
const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    
  const token = req.headers['x-access-token'] || req.headers['authorization'];
	let splitToken = token.split(' ')[1];
  if (!splitToken) {
    return res.status(403).json({ 
        message : "A token is required for authentication"
    });
  }
  try {
    const decoded = jwt.verify(splitToken, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({
        message : "Invalid Token... Token has been Expired !!! Please Login"
    });
  }
  return next();
};

module.exports = verifyToken;

