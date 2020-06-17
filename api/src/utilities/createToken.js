const jwt = require('jsonwebtoken');

const createToken = async (payload, secret, expiration) => {
  try {
    const token = await jwt.sign(payload, secret, {
      expiresIn: expiration
    });
    return token;
  } catch (error) {
    console.error(error);
  }
}

module.exports = createToken;