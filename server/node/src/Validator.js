const validator = require('validator')
//const Enums = require("./Enums.js");

// TODO: https://www.npmjs.com/package/jsonschema
function validateSignal(signal) {
    if(isNotEmptyObject(signal, "Invalid signal")) {
        if(isNotEmptyString(signal.date_time), "Invalid date_time") {
            return signal;
        }
    }
    throw new Error("ERROR400: Invalid signal json");
}


function isValidEmail(email) {
    if (email && validator.isEmail(email.toString())) {
        return true;
    }
    throw new Error("ERROR400: Invalid email");
}


function isNotEmptyString(value, txt = "") {
    if (!value || validator.isEmpty(value)) {
        throw new Error("ERROR400: String is empty." + txt);
    }
    return true;
}


function isValidPassword(pass) {
    if (pass && pass.toString().length >= 6) {
        return true;
    }
    throw new Error("Invalid password");
}


function isNotEmptyObject(data, errormsg = "Invalid data") {
    if (data) {
        return true;
    }
    throw new Error(errormsg);
}


function isNumber(number) {
    if (validator.isNumeric(number)) {
        return true;
    }
    throw new Error("ERROR400 - not a number");
}


/**
 * Validates a UserInfo json object
 * @param {UserInfo json} user sent from the mobile phone at register
 * @returns the user (the parameter)
 */
function validateUser(user) {
    if (isNotEmptyObject(user, "Invalid user")) {
        if (isValidEmail(user.getEmail())) {
            return user;
        }
    }
    throw new Error("Invalid user!");
}


/**
 * Validates a login info object
 * @param {LoginInfo object} login 
 * @returns the parameter, the login
 */
function isValidLoginInfo(login) {
    if (isNotEmptyObject(login, "Invalid login data")) {
        if (isValidEmail(login.email)) {
            if (isValidPassword(login.password)) {
                return login;
            }
        }
    }
    return null;
}


/**
 * Validates a db insert result
 * @param {DbResult object} result Result returned by db at insert
 * @param {String} text Text to set in Error
 */
function validateDbInsert(result, text = "Insert failed") {
    if (!result || result.affectedRows !== 1) {
        throw new Error("ERROR500 - " + text);
    }
}


/**
 * Validates a db delete result
 * @param {DbResult object} result Result returned by db at delete
 * @param {String} text Text to set in Error
 */
function validateDbDelete(result, text = "Delete failed") {
    if (!result || result.affectedRows !== 1) {
        throw new Error("ERROR500 - " + text);
    }
}


module.exports = {
    validateSignal,
    isValidEmail,
    isNotEmptyObject,
    validateUser,
    isValidLoginInfo,
    validateDbInsert,
    validateDbDelete
}
