const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../src/User.js");
const Enums = require("./Enums.js");
const Time = require("./Time.js");

const debug = process.env.DEBUG === "true";
const expireTime = process.env.NODE_JWT_EXP || "1y"
const secret = process.env.NODE_LOGIN_SECRET || '1234567890abcdefghijklmnopqrstvzx';


/**
 * Compares a password and a password-hash
 * @param {String} password password to compare
 * @param {String} hash password hash to compare
 * @returns true if the hash is the passwords hash, false otherwise
 */
async function matchPassword(password, hash) {
    if (await bcrypt.compare(password, hash)) {
        return true;
    }
    throw new Error("Wrong password");
}


/**
 * Returns the secret key used by the server
 * @returns secret as string
 */
function getSecret() {
    const salt = "k2iBcP08By6cxKNxA3HoPxA73BHShK095dNJkfS2apP7vU8dTf3Sa542";
    return secret + salt;
}


/**
 * Creates a token
 * @param {Number} user_id id of the user to sign
 * @returns json web token
 */
function sign(user_id) {
    console.log("JWT expires in " + expireTime + " from " + Time.getTimeNow());
    const token = jwt.sign(
        {
            userId: user_id
        },
        getSecret(),
        { expiresIn: expireTime }
    );
    return token;
}


/**
 * Validates a jwt token
 * @param {String} token Bearer token (jwt) to validate
 * @returns the userId/uuid/boatId of the user or throws error
 */
function verifyToken(token) {
    if (!token) {
        throw new Error('Access denied, you need to login');
    }
    const decoded = jwt.verify(token, getSecret());
    if (debug) console.log(decoded);
    return { "userId": decoded.userId };
}


/**
 * Authenticates a user by jwt and role
 * @param {String} token jwt token sent by client
 * @returns the user id if the user is authenticated,otherwise error is thrown
 */
async function authenticateToken(token) {
    const auth = verifyToken(token);
    const userid = auth.userId;

    if (debug) console.log("User " + userid + " authenticated");
    return { "userId": userid};
}


// https://dvmhn07.medium.com/jwt-authentication-in-node-js-a-practical-guide-c8ab1b432a49
// https://talent500.co/blog/implementing-user-authentication-and-authorization-using-jwt-json-web-tokens-and-bcrypt/


module.exports = {
    matchPassword,
    sign,
    authenticateToken,
    verifyToken
}
