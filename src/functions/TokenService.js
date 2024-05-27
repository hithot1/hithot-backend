const jwt = require("jsonwebtoken");
const commonConfig = require("../config/common.config");

module.exports = {
  async generateTokens(data) {
    const accessToken = jwt.sign(data, commonConfig.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: commonConfig.JWT_TOKEN_LIFE,
    });
    const refreshToken = jwt.sign(data, commonConfig.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: commonConfig.JWT_REFRESH_TOKEN_LIFE,
    });
    const token = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
    return token;
  },

  /** ***** Token Service: Method to generate access token after expiry ******/
  async generateAccessTokens(data) {
    const accessToken = jwt.sign(data, commonConfig.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: commonConfig.JWT_TOKEN_LIFE,
    });
    const token = {
      access_token: accessToken,
    };
    return token;
  },

  /** ***** Token Service: Method to generate email token after expiry ******/
  async generateEmailTokens(data) {
    const emailToken = jwt.sign(data, commonConfig.JWT_EMAIL_TOKEN_SECRET, {
      expiresIn: commonConfig.JWT_EMAIL_TOKEN_LIFE,
    });
    return emailToken;
  },

  /** ***** Token Service: Method to get expiry of token ******/
  async getTokenExpiry(token) {
    const decode = jwt.verify(token, commonConfig.JWT_ACCESS_TOKEN_SECRET);
    return decode;
  },

  /** ***** Token Service: Method to get expiry of token ******/
  async refreshTokenExpiry({ decoded }) {
    const data = {
      id: decoded.id,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email,
    };

    const accessToken = jwt.sign(data, commonConfig.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: commonConfig.JWT_TOKEN_LIFE,
    });
    const token = {
      access_token: accessToken,
    };
    return token;
  },
};
