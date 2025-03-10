const DB = require('./db/mariadb.js');

let pool = DB.getConn();
const debug = process.env.DEBUG === "true";

module.exports = class Signal {
    #date_time;
    #group_uuid;
    #signal_type;


    /**
     * Creates a new boat based on the data from the boat parameter
     * @param {JSON object} boat See BoatInfo.json
     */
    constructor(signal) {
        if (signal) {
            this.#date_time = signal.date_time;
            this.#group_uuid = signal.group_uuid;
            this.#signal_type = signal.signal_type;
        }
    }

    /**
     * Getter for date/time
     * @returns the date/time the signal goes
     */
    getDateTime() {
        return this.#date_time;
    }


    /**
     * Getter for group id
     * @returns the group id
     */
    getGroupId(){
        return this.#group_uuid;
    }


    /**
     * Getter for signal type
     * @returns StartSignal(short), OneMinSignal(long),
     *          FourMinSignal(short) or FiveMinSignal(short)
     */
    getSignalType() {
        return this.#signal_type;
    }

    /**
     * 
     * @param {*} signal req.body
     */
    async addSignal(signal) {

    }

    /**
     * Returns all signals corresponding to a group id
     * @param {*} group_uuid 
     * @returns list of signals
     */
    async getSignalsByGroupId(group_uuid) {
        const query = "SELECT * FROM signal WHERE group_id=?;";
        const result = await pool.query(query, [group_uuid]);

        if (!result || result.length < 1) {
            throw new Error("Signal (" + group_uuid + ") not found.");
        }

        return result;
    }


    /**
     * Deletes all the signals with the specified group id
     * @param {*} group_uuid 
     */
    async deleteSignal(group_uuid) {

    }

}
