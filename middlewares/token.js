const jwt = require("jsonwebtoken");
const accessTokenGenerator = (username) => {
  const token = jwt.sign({ username }, process.env.ACCESS_KEY, {
    expiresIn: "1800000000seconds",
  });
  return token;
};
const accessTokenValidator = (token) => {
  try {
    const data = jwt.verify(token, process.env.ACCESS_KEY);
    return data;
  } catch (error) {
    return false;
  }
};
let refreshTokens = [];
const refreshTokenGenerator = (username) => {
  const token = jwt.sign({ username }, process.env.REFRESH_KEY, {
    expiresIn: "3600seconds",
  });

  return token;
};
const refreshTokenValidator = (token) => {
  try {
    const data = jwt.verify(token, process.env.REFRESH_KEY);
    return data;
  } catch (error) {
    return false;
  }
};
//format of token: bearer<access token>
const accessTokenVerify = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    //  console.log(bearerHeader)
    const bearer = bearerHeader.split(" ");
    // console.log(bearer)
    const bearerToken = bearer[1];
    req.token = bearerToken;
    const valid = accessTokenValidator(req.token);
    if (valid) {
      next();
    } else {
      res.send("access token expired");
    }
  } else {
    res.send("No token");
  }
};
const refreshTokenVerify = async (req, res, next) => {
  const refresh_token = req.body.refresh_token;
  const valid = refreshTokenValidator(refresh_token);
  if (valid) {
    next();
  } else {
    res.send("Refresh token expired");
  }
};
module.exports = {
  accessTokenGenerator,
  refreshTokenGenerator,
  accessTokenValidator,
  refreshTokenValidator,
  accessTokenVerify,
  refreshTokenVerify,
  refreshTokens,
};
