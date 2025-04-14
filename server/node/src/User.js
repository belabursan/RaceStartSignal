const DB = require('./db/mariadb.js');
const bcrypt = require('bcrypt');

let pool = DB.getConn();
const develop = process.env.DEVELOP === "true";
const debug = process.env.DEBUG === "true";

/*
    `user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(64) UNIQUE NOT NULL,
    `pass_hash` VARCHAR(128) NOT NULL,
*/

/**
 * User class handles the user interactopn with the DB
 */
module.exports = class User {
    #user_id;
    #email;
    #salt;
    #pass_hash;


    /**
     * Creates a new user based on the data from the user parameter
     * @param {string} email See UserInfo.json
     */
    constructor(email) {
        if (email) {
            this.#email = decodeURIComponent(email).toString();
            this.#salt = "1234567890ABCDEF"; //randomize later....
        }
    }


    /**
     * Returns the json representation of the user object
     * @returns User object as json string
     */
    toUserInfoJson() {
        return JSON.stringify({
            email: this.#email,
            salt: this.#salt
        });
    }


    /**
     * Returns the string representation of this object
     */
    toString() {
        const str = "\n{\n  user_id: " + this.#user_id +
            "\n  email: " + this.#email +
            "\n  salt: " + this.#salt +
            "\n  pass_hash: " + this.#pass_hash +
            "\n}\n";
        return str;
    }


    /**
     * Returns a hash for the given `content`.
     *
     * @param {String} password password to hash
     * @returns {String} md5 sum hash of password
     */
    async #hashPassword(password) {
        if (develop) console.log("PASS: " + password);
        return await bcrypt.hash(password, 10);
    }


    /**
     * Generates a pass/hash and set it in this object
     * @param {Integer} length Length of the password to generate, default is 10
     * @returns password and hash of the password: {"password":pass, "hash":hash}
     */
    async #generatePassword(length = 10) {
        let counter = 0;
        let pass = '';
        const characters = '!ABCDEFGHIJKLMNO&PQRSTUVWXYZ_abcdefghijklmno%pqrstuvwxyz*0123456789?' + this.#salt;
        const charactersLength = characters.length;

        while (counter < length) {
            pass += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        const hash = await this.#hashPassword(pass);
        const result = { "password": pass, "hash": hash };
        return result;
    }


    /**
     * Sets all the class variables
     * @param {Object} result is the returned object from the db
     */
    setResult(result) {
        this.#user_id = result.user_id;
        this.#email = result.email;
        this.#pass_hash = result.pass_hash;
    }


    /**
     * Adds this user to the database
     * @returns An object containing {id and pass}
     */
    async addUserToDb() {
        const pass = await this.#generatePassword();
        const query = "INSERT INTO user_info (email, pass_hash) VALUES(?, ?);";
        const data = [this.#email, pass.hash];
        const result = await pool.query(query, data);
        // set id and pass AFTER insertion is ok
        this.#user_id = result.insertId;
        this.#pass_hash = pass.hash;
        return { "id": this.#user_id, "password": pass.password };
    }


    /**
     * Updates a users name, email and phone in db
     * @param {UserInfo json object} newUser Values of the new user to set
     */
    async update(newUser) {
        const query = "UPDATE user_info SET email=?, WHERE user_id=?;";
        const data = [newUser.email, this.#user_id];
        const result = await pool.query(query, data);

        if (result.affectedRows === 1) {
            console.log("user " + this.#user_id + " updated");
        } else {
            throw new Error("User not updated");
        }
    }


    /**
     * Returns the hashed password
     * @returns 
     */
    getPassHash() {
        return this.#pass_hash;
    }


    /**
     * Getter for id
     * @returns id of this user
     */
    getId() {
        return this.#user_id;
    }


    /**
     * Getter for email
     * @returns email as string
     */
    getEmail() {
        return this.#email;
    }


    /**
    * Get the user corresponding th email
    * @param {String} email Email to get user for
    * @returns the user object
    */
    static async getUserIdByEmail(email) {
        const user = new User();
        const query = "SELECT * FROM user_info WHERE email=?;";
        const result = await pool.query(query, [email]);

        if (!result || result.length < 1) {
            throw new Error("User (" + email + ") not found.");
        }
        const id = result[0].user_id;
        if (id < 1) {
            throw new Error("Corrupt data?");
        }
        user.setResult(result[0]);
        return user;
    }


    /**
     * Returns a user identified by id
     * @param {Number} id id of the user to get
     * @returns User object corresponding the id
     */
    static async getUserIdById(id) {
        const user = new User();
        const query = "SELECT * FROM user_info WHERE user_id=?;";
        const result = await pool.query(query, [id]);

        if (!result || result.length < 1) {
            throw new Error("User (" + id + ") not found.");
        }
        user.setResult(result[0]);
        return user;
    }


    /**
     * Deletes a user from the database
     * @returns result of db deletion
     */
    async deleteUser() {
        const query = "DELETE FROM `user_info` WHERE user_id=?;";
        const result = await pool.query(query, [this.#user_id]);
    }


    /**
     * Resets the password for this user
     * @returns the new password
     */
    async doResetPassword() {
        const pass = await this.#generatePassword();
        const query = "UPDATE user_info SET pass_hash = ? WHERE user_id = ?;";
        const data = [pass.hash, this.#user_id];
        const result = await pool.query(query, data);
        if (debug) console.log(result);
        if (result.affectedRows == 1 && result.warningStatus == 0) {
            return pass.password;
        }
        throw new Error("ERROR500 - Could not save new pass hash");
    }


    /**
     * Update the password hash and return the new password
     * @param {String} email Email of user to reset password for
     * @returns new password as string
     */
    static async resetPassword(email) {
        console.log("reset password");
        const user = await this.getUserIdByEmail(email);
        return await user.doResetPassword();
    }

}
