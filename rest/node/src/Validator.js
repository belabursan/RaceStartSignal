const validator = require('validator')
const Enums = require("./Enums.js");

// TODO: https://www.npmjs.com/package/jsonschema

function isValidEmail(email) {
    if (email && validator.isEmail(email.toString())) {
        return true;
    }
    throw new Error("Invalid email");
}


function isValidName(name) {
    if (name && name.toString().length >= 2) {
        return true;
    }
    throw new Error("Invalid name");
}

function isNotEmptyString(value, txt = "") {
    if (!value || validator.isEmpty(value)) {
        throw new Error("String is empty." + txt);
    }
    return true;
}


function isValidRole(role, allowSysAdmin) {
    if (role == Enums.ROLE.USER || role == Enums.ROLE.ADMIN) {
        return true;
    }
    if (allowSysAdmin && role == Enums.ROLE.SYSADMIN) {
        return true;
    }
    throw new Error("ERROR400 - Invalid role: " + role);
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


function isValidSrs(srs) {
    const options = { min: 0.1, max: 3.5 };
    if (srs
        && typeof srs === 'number'
        && validator.isFloat(srs.toString(), options)) {
        return true;
    }
    throw new Error("ERROR400: Invalid srs.");
}


function isNumber(number) {
    if (validator.isNumeric(number)) {
        return true;
    }
    throw new Error("ERROR400 - not a number");
}


/**
 * Validates if a position has valid latitude and longitude
 * @param {Position object} position Position to check
 * @returns true if position is valid, false otherwise
 */
function isPosition(position) {
    if (position) {
        try {
            if (isNumber("" + position.longitude)) {
                if (isNumber("" + position.latitude)) {
                    return true;
                }
            }
        } catch (error) {
            throw new Error("Invalid position: " + error.message);
        }
    }
    throw new Error("Invalid position");
}


/**
* Handles the sysadmin errors.
* @param {Error} error error caught by try-catch
* @returns code/message to return to client
*/
function handleError(error) {
    const errorMessage = error.message;
    let code = 503;
    let message = "Server busy, try again later.";

    const error_400 = ["ERROR400", "String is empty.", "Data truncated for column 'status'", "Incorrect time value", "SQLState: 01000) Data truncated for column 'role'", "'startline_name' cannot be null", "Boat not found.", ") not found.", "Invalid email", "Invalid name", "Invalid user"];
    const error_401 = ["ERROR401",  "jwt expired", "Unauthorized. (", "Access denied, you need to login", "not matching id", "JsonWebTokenError: invalid signature"];
    const error_405 = ["ERROR405"];
    const error_409 = ["ERROR409", "Duplicate entry", "Already joined"];

    if (error_400.find(word => errorMessage.includes(word)) !== undefined) {
        code = 400;
        message = "Not found or invalid data.";
    } else if (error_401.find(word => errorMessage.includes(word)) !== undefined) {
        code = 401;
        message = "Unauthorized.";
    } else if (error_405.find(word => errorMessage.includes(word)) !== undefined) {
        code = 405;
        message = "Not allowed.";
    } else if (error_409.find(word => errorMessage.includes(word)) !== undefined) {
        code = 409;
        message = "Already exists";
    }
    console.log(errorMessage);

    return { code, message };
}


/**
 * Validates a UserInfo json object
 * @param {UserInfo json} user sent from the mobile phone at register
 * @param {boolean} [fix_role=true] Set "USER" as role if not already set
 * @returns the user (the parameter)
 */
function validateUser(user, fix_role = true) {
    if (isNotEmptyObject(user, "Invalid user")) {
        if (isValidEmail(user.email)) {
            if (isValidName(user.name)) {
                if (fix_role && user.role != "USER") {
                    console.log("Warning, setting role to USER");
                    user.role = "USER";
                }
                return user;
            }
        }
    }
    return null;
}


/**
 * Validates the format and value of the boat json object
 * @param {Object} boat boat sent from client to validate
 * @returns true or throws error
 */
function validateBoat(boat) {
    if (isNotEmptyObject(boat, "Invalid boat")) {
        if (isNotEmptyString(boat.type, "(type)")) {
            if (isNotEmptyString(boat.name, "(name)")) {
                if (isNotEmptyString(boat.sail_number, "(sail_number)")) {
                    if (isValidSrs(boat.srs_shorthand_no_flying)) {
                        if (isValidSrs(boat.srs_shorthand)) {
                            if (isValidSrs(boat.srs_no_flying)) {
                                if (isValidSrs(boat.srs_default)) {
                                    return boat;
                                }
                            }
                        }
                    }

                }
            }
        }
    }
    return null;
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
 * Validates a race object
 * @param {Race object} Race to validate
 * @returns the race
 */
function validateNewRace(race) {
    if (isNotEmptyObject(race, "Invalid login data")) {
        if (isNotEmptyObject(race.race_header, "Invalid race header")) {
            if (isNotEmptyString(race.race_header.name, "(name)")) {
                if (isNotEmptyString(race.race_header.date, "(date)")) {
                    if (isNotEmptyString(race.race_header.start_time, "(start_time)")) {
                        if (isNotEmptyString(race.race_header.stop_time, "(stop_time)")) {
                            if (isNotEmptyString(race.race_type, "(race_type)")) {
                                if (isNumber("" + race.start_line)) {
                                    return race;
                                }
                            }
                        }
                    }
                }
            }

        }
    }
    return null;
}


/**
 * Validates a start line sent by client
 * @param {StartLine object} startLine start line to validate
 * @returns the start line or throws error
 */
function validateStarLine(startLine) {
    if (isNotEmptyObject(startLine, "Invalid start line data")) {
        if (isNumber("" + startLine.harbor_id)) {
            if (isPosition(startLine.position_start_flag)) {
                if (isPosition(startLine.position_signal_boat)) {
                    if (isPosition(startLine.position_first_mark)) {
                        return startLine;
                    }
                }
            }
        }
    }
    return null;
}


/**
 * Validates a role
 * @param {RoleInfo object} role roleInfo to validate
 * @param {boolean} [allowSysAdmin=false] allow or not allow sysadmin
 * @returns The role or throws exception
 */
function validateRole(role, allowSysAdmin = false) {
    if (isNotEmptyObject(role, "Invalid role data")) {
        if (isNotEmptyString(role.role, "(role)")) {
            if (isValidRole(role.role, allowSysAdmin)) {
                if (role.user_id > 0) {
                    return role;
                } else {
                    throw new Error("ERROR400 - User id for role is not valid");
                }
            }
        }
    }
    return null;
}


/**
 * Validates a Course Ínfo object
 * @param {CourseInfo object} courseInfo Course to validate
 * @returns The course info or throws error
 */
function validateCourse(courseInfo) {
    if (isNotEmptyObject(courseInfo, "Invalid course data")) {
        if (isNumber("" + courseInfo.race_id)) {
            if (isNumber("" + courseInfo.wind_direction)) {
                if (isNumber("" + courseInfo.wind_strength)) {
                    if (isNotEmptyString(courseInfo.course)) {
                        return courseInfo;
                    }
                }
            }
        }
    }
    return null;
}


/**
 * Validates a race status
 * @param {RaceStatus object} raceStatus race status to validate
 */
function validateRaceStatus(raceStatus) {
    if (isNotEmptyObject(raceStatus, "Invalid race status data")) {
        if (isNumber("" + raceStatus.race_id)) {
            if (isNotEmptyString(raceStatus.status, "(status)")) {
                return raceStatus;
            }
        }
    }
}


/**
 * Validates the season info sent from client
 * @param {SeasonInfo object} seasonInfo from client
 * @returns 
 */
function validateSeason(seasonInfo) {
    if (isNotEmptyObject(seasonInfo, "Invalid season info")) {
        if (isNotEmptyString(seasonInfo.season_name, "Invalid season name")) {
            if (isNotEmptyString(seasonInfo.season_start, "Invalid season start")) {
                if (isNotEmptyString(seasonInfo.season_end, "Invalid season end")) {
                    return seasonInfo;
                }
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
    isValidEmail,
    isValidName,
    isNotEmptyObject,
    validateUser,
    isValidLoginInfo,
    validateBoat,
    validateNewRace,
    validateStarLine,
    handleError,
    validateRole,
    validateCourse,
    validateRaceStatus,
    validateSeason,
    validateDbInsert,
    validateDbDelete
}
