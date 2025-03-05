const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../src/User.js");
const Enums = require("./Enums.js");
const Time = require("./Time.js");

const debug = process.env.DEBUG === "true";
const expireTime = process.env.NODE_JWT_EXP || "1y"
const secret = process.env.NODE_LOGIN_SECRET || '1234567890abcdefghijklmnopqrstvzx';
const secureLogin = process.env.NODE_SECURE_LOGIN === "true";


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
 * @param {Number} boat_id id of the boat of the user
 * @param {String} uuid uuid of the user
 * @returns json web token
 */
function sign(user_id, boat_id, uuid) {
    console.log("JWT expires in " + expireTime + " from " + Time.getTimeNow());
    const token = jwt.sign(
        {
            userId: user_id,
            boatId: boat_id,
            userUUID: uuid
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
    return { "userId": decoded.userId, "uuid": decoded.userUUID, "boatId": decoded.boatId };
}


/**
 * Compares two uuid
 * @param {String} userUUID users uuid
 * @param {String} authUUID uuid from token
 * @return true if uuids match, throw exception otherwise
 */
function matchUUID(userUUID, authUUID) {
    if (userUUID && authUUID && (userUUID.toString() === authUUID.toString())) {
        return true;
    }
    throw new Error("not matching id, old token?");
}


/**
 * Authenticates a user by jwt and role
 * @param {String} token jwt token sent by client
 * @returns the user id if the user is authenticated and admin/sysadmin or throws error
 */
async function authenticateToken(token, admin = false, sysadmin = false) {
    const auth = verifyToken(token);
    const userid = auth.userId;
    const boatid = auth.boatId;

    if (admin || sysadmin || secureLogin) {

        const user = await User.getUserIdById(userid);
        const role = user.getRole();

        if (secureLogin) {
            matchUUID(user.getUUID(), auth.uuid);
        }
        if (sysadmin && (role !== Enums.ROLE.SYSADMIN)) {
            console.log("User role is: " + role);
            throw new Error("ERROR401 - not sysadmin");
        }
        if (admin && (role === Enums.ROLE.USER)) { //admin and sysadmin allowed
            console.log("User role is: " + role);
            throw new Error("ERROR401 - not admin");
        }
    }
    if (debug) console.log("User " + userid + " authenticated (" + boatid + ")");
    return { "userId": userid, "boatId": boatid };
}


// https://dvmhn07.medium.com/jwt-authentication-in-node-js-a-practical-guide-c8ab1b432a49
// https://talent500.co/blog/implementing-user-authentication-and-authorization-using-jwt-json-web-tokens-and-bcrypt/


module.exports = {
    matchPassword,
    sign,
    authenticateToken,
    matchUUID,
    verifyToken
}
