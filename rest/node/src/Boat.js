const DB = require('./db/mariadb.js');

let pool = DB.getConn();
const debug = process.env.DEBUG === "true";

module.exports = class Boat {
    #boat_id;
    #user_id;
    #type;
    #name;
    #sail_number;
    #srs_shorthand_no_flying;
    #srs_shorthand;
    #srs_no_flying;
    #srs_default;
    #skipper_name;


    /**
     * Creates a new boat based on the data from the boat parameter
     * @param {JSON object} boat See BoatInfo.json
     */
    constructor(boat) {
        if (boat) {
            this.#boat_id = boat.id;
        }
    }


    /**
     * Returns the json representation of the boat object that can be sent to client
     * @returns Boat object as json string, see boat_info.json
     */
    toBoatInfoJson() {
        return JSON.stringify({
            type: this.#type,
            name: this.#name,
            sail_number: this.#sail_number,
            srs_shorthand_no_flying: this.#srs_shorthand_no_flying,
            srs_shorthand: this.#srs_shorthand,
            srs_no_flying: this.#srs_no_flying,
            srs_default: this.#srs_default,
            skipper_name: this.#skipper_name
        });
    }


    /**
     * Returns the string representation of this object
     */
    toString() {
        const str = "\n{\n  boat_id: " + this.#boat_id +
            "\n  user_id: " + this.#user_id +
            "\n  type: " + this.#type +
            "\n  name: " + this.#name +
            "\n  sail_number: " + this.#sail_number +
            "\n  srs_shorthand_no_flying: " + this.#srs_shorthand_no_flying +
            "\n  srs_shorthand: " + this.#srs_shorthand +
            "\n  srs_no_flying: " + this.#srs_no_flying +
            "\n  srs_default: " + this.#srs_default +
            "\n  skipper_name: " + this.#skipper_name +
            "\n}\n";
        return str;
    }


    /**
     * Sets all the variables of this object with the result from db.
     * @param {DBResult} boatData result from db
     */
    setDbResult(boatData) {
        this.#boat_id = boatData.boat_id;
        this.#user_id = boatData.user_id;
        this.#type = boatData.type;
        this.#name = boatData.name;
        this.#sail_number = boatData.sail_number;
        this.#srs_shorthand_no_flying = boatData.srs_shorthand_no_flying;
        this.#srs_shorthand = boatData.srs_shorthand;
        this.#srs_no_flying = boatData.srs_no_flying;
        this.#srs_default = boatData.srs_default;
        this.#skipper_name = boatData.skipper_name;
    }


    /**
     * Updates a boat with new data
     * @param {Object} boatData new data to set
     */
    async update(boatData) {
        if (debug) console.log("trying to update boat");
        const query = "UPDATE boat_info SET type=?, name=?, sail_number=?, \
        srs_shorthand_no_flying=?, srs_shorthand=?, srs_no_flying=?, \
        srs_default=?, skipper_name=? WHERE boat_id=?;";
        const data = [boatData.type, boatData.name, boatData.sail_number,
        boatData.srs_shorthand_no_flying, boatData.srs_shorthand,
        boatData.srs_no_flying, boatData.srs_default, boatData.skipper_name, this.#boat_id];
        const result = await pool.query(query, data);

        if (result.affectedRows === 1) {
            console.log("boat " + this.#boat_id + " updated");
        } else {
            throw new Error("Boat not updated");
        }
    }


    /**
     * Returns a boat identified by the owner
     * @param {Number} userId id of the owner, see "user_info" table
     * @returns the boat found by user id or throws exception.
     */
    static async getBoatByUserId(userId) {
        const boat = new Boat();
        const query = "SELECT * FROM boat_info WHERE user_id=?;";
        const result = await pool.query(query, [userId]);

        if (!result || result.length < 1) {
            throw new Error("Boat not found.");
        }
        if (result.length > 1) {
            console.log("WARNING: multiple boats for same user!");
        }

        boat.setDbResult(result[0]);
        return boat;
    }


    /**
     * Deletes all boats whith the defined user id
     * @param {Number} userId id of the user(owner) of the boat
     * @returns the database query result
     */
    static async deleteBoatByUserId(userId) {
        const query = "DELETE FROM `boat_info` WHERE user_id=?;";
        return await pool.query(query, [userId]);
    }


    /**
     * Adds a new boat and sets the user id, the rest are undefined
     * @param {Number} userId id of the user(owner) of the boat
     * @returns the database query result
     */
    static async addBoatToDb(userId) {
        //set user id to "connect" the empty boat to the user with userId
        return await pool.query("INSERT INTO boat_info (user_id) VALUES(?);", [userId]);
    }


    /**
     * Returns the boat id of the boat owned by the user with userId
     * @param {Number} userId User id of the owner
     * @returns the boat id as Number
     */
    static async getBoatId(userId) {
        const result = await pool.query("SELECT boat_id FROM boat_info WHERE user_id=?;", [userId]);
        return result[0].boat_id;
    }

}
