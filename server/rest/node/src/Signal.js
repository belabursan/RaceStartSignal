const DB = require('./db/mariadb.js');
const { SIGNAL_TYPE } = require('./Enums.js');

let pool = DB.getConn();
const debug = process.env.DEBUG === "true";

module.exports = class Signal {
    #id;
    #group_id;
    #date_time;
    #one_min_signal;
    #four_min_signal;
    #five_min_signal;
    #signal_type;


    /**
     * Creates a new signal based on the data from the signal parameter
     * @param {JSON object} signal See Signal in openapi.yaml
     */
    constructor(signal) {
        this.#id = 0;
        this.#group_id = 0;
        this.#signal_type = SIGNAL_TYPE.None;
        if (signal) {
            this.#date_time = signal.date_time;
            this.#one_min_signal = signal.one_minute;
            this.#four_min_signal = signal.four_minute;
            this.#five_min_signal = signal.five_minute;
        } else {
            console.log("Signal is empty");
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
        return this.#group_id;
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
     * Adds a signal to the database
     */
    async addSignal() {
        const query = "INSERT INTO signal (date_time, signal_type) VALUES(?, ?);";
        const id = await pool.query(query, [this.#date_time, SIGNAL_TYPE.StartSignal], (err, res) => {
            if (err) {
                console.log(err);
                throw new Error("Error when adding signal to db");
            }
            return res.insertId;
        });
        console.log("Added signal with id: " + id);
        return id;
    }


    /**
     * Returns all signals corresponding to a group id
     * @param {*} group_uuid 
     * @returns list of signals
     */
    async getSignalsByGroupId(group_uuid) {
        const query = "SELECT * FROM signal WHERE group_id=?;";
        const result = await pool.query(query, [group_uuid], (err, res) => {
            if (err) {
                console.log(err);
                throw new Error("Error when getting signals");
            }
            return res;
        });

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
