
//import {v4 as uuidv4} from 'uuid';
const Uuid = require("uuid");


/**
 * Compares tvo uuid
 * @param {*} uuid_1 
 * @param {*} uuid_2 
 * @returns true if uuid 1 matches uuid 2, false otherwise
 */
function matchUUID(uuid_1, uuid_2) {
    if (Uuid.validate(uuid_1)
        && Uuid.validate(uuid_2)
        && (uuid_1.toString() === uuid_2.toString())) {
        return true;
    }
    console.warn("UUID doesn't match!");
    return false;
}

/**
 * Generates a new uuid
 * @returns new uuid
 */
function generateUUID() {
    let uuid = Uuid.v4();
    console.debug("Generated uuid: " + uuid);
    return uuid;
}

module.exports = {
    matchUUID,
    generateUUID
}
