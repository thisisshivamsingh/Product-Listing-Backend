const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (apiKey, statusCode, res) => {
  const token = signToken(apiKey);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: 1,
    message: "Token generated successfully",
    data: {
      token,
    },
    token_expire_time: cookieOptions.expires,
  });
};

exports.createToken = async (req, res, next) => {
  let elemIndx = req.rawHeaders.indexOf("Api-key");
  const value = req.rawHeaders[elemIndx + 1];

  if (value && process.env.API_KEY === value) {
    createSendToken(value, 201, res);
    next();
  } else {
    res.status(401).json({
      status: "failed",
      message: "Something went wrong with Api-key",
    });
  }
};

exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;

  let apiKeyIndx = req.rawHeaders.indexOf("Api-key");
  const apiKeyValue = req.rawHeaders[apiKeyIndx + 1];
  let authTokenKeyIndx = req.rawHeaders.indexOf("Auth-token");
  const authTokenValue = req.rawHeaders[authTokenKeyIndx + 1];

  if (authTokenValue) {
    token = authTokenValue;
  }

  if (process.env.API_KEY != apiKeyValue) {
    return res.status(401).json({
      status: "failed",
      message: "Something wennt wrong with Api-key",
    });
  }

  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "Send Token",
    });
  }

  try {
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    if (apiKeyValue != decoded.id) {
      return res.status(401).json({
        status: "failed",
        message: "Api key does not correct",
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};
