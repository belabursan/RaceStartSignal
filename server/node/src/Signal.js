const DB = require('./db/mariadb.js');
const Time = require('./Time.js');
const { SIGNAL_TYPE } = require('./Enums.js');

let pool = DB.getConn();
const debug = process.env.DEBUG === "true";

module.exports = class Signal {

    static #CONFIG_ROW_ID = 1;

    /**
     * Debug log
     * @param {string} txt text to print
     */
    static #dd(txt) {
        if (debug) console.log(txt);
    }

    /**
     * Info log
     * @param {string} txt text to print
     */
    static #ii(txt) {
        console.log(txt);
    }

    /**
     * Returns all signals from the database
     * @returns {Array} all signals as a list
     */
    static async getSignals() {
        Signal.#dd("Getting all signals");
        const result = await pool.query("SELECT id, group_id, signal_type, DATE_FORMAT(date_time,'%Y-%m-%d %T') AS date_time FROM signals ORDER BY date_time ASC;");
        return result;
    }

    /**
     * Inserts a new signal into the database
     * @param {JSON} signal data from web
     * @returns {number} the group id
     */
    static async addSignal(signal) {
        var gid = -1;
        const times = Time.getFiveSeriesTime(signal.date_time, signal.five_min_serie, signal.yellow_flag);
        Signal.#ii("Adding signal at: " + times[Time.StartSignal] + " (" + signal.five_min_serie + "-" + signal.yellow_flag + ")");
        try {
            await pool.query('START TRANSACTION;');
            gid = await Signal.#insert(times[Time.StartSignal], 0, SIGNAL_TYPE.StartSignal);
            await Signal.#setGroup(gid);

            if (signal.five_min_serie === true) {
                Signal.#dd("Adding five min signals");
                await Signal.#insert(times[Time.OneMinSignal], gid, SIGNAL_TYPE.OneMinSignal);
                await Signal.#insert(times[Time.FourMinSignal], gid, SIGNAL_TYPE.FourMinSignal);
                await Signal.#insert(times[Time.FiveMinSignal], gid, SIGNAL_TYPE.FiveMinSignal);
                if (signal.yellow_flag === true) {
                    Signal.#dd("Adding yellow flag signal");
                    await Signal.#insert(times[Time.YellowSignal], gid, SIGNAL_TYPE.YellowFlag);
                }
            }
            await Signal.#setListChanged();
            await pool.query('COMMIT;');
        } catch (error) {
            Signal.#ii("Exception when adding signal!");
            Signal.#ii(error);
            Signal.#ii("Rolling back...");
            await pool.query('ROLLBACK;');
            if (error.message.includes("Duplicate entry")) {
                throw error;
            }
            throw new Error("ERROR 503: Error when adding signal");
        }
        Signal.#ii("Signal(s) with gid: " + gid + " added successfully");
        return gid;
    }

    /**
     * Changes the time for the list_changed column
     * @returns the result of the update
     */
    static async #setListChanged() {
        return await Signal.#setCLChanged("list_changed");
    }

    /**
     * Changes the time for the conf_changed column
     * @returns the result of the update
     */
    static async #setConfChanged() {
        return await Signal.#setCLChanged("conf_changed");
    }


    static async #setCLChanged(column) {
        const query = "UPDATE app_config SET " + column + "=CURRENT_TIMESTAMP WHERE id=?;";
        //const time = Time.getConfigTime();
        return await pool.query(query, [Signal.#CONFIG_ROW_ID]);
    }


    /**
     * Deletes all the signals with the specified group id
     * @param {number} group_id 
     */
    static async deleteSignalByGroupId(group_id) {
        Signal.#ii("Deleting signals with group id: " + group_id);
        return await pool.query("DELETE FROM signals WHERE group_id=?;", [group_id]);
    }


    /**
     * Inserts a new signal into the database
     * @param {string} datetime Date and time of the signal
     * @param {number} group_id Group id of the signal
     * @param {number} signal_type Type of the signal
     * @returns {number} row id of the inserted signal
     */
    static async #insert(datetime, group_id, signal_type) {
        Signal.#dd("Inserting signal: " + datetime);
        const query = "INSERT INTO signals (date_time, group_id, signal_type) VALUES(?, ?, ?);";
        const result = await pool.query(query, [datetime, group_id, signal_type]);
        if (result.affectedRows == 1 && result.warningStatus == 0) {
            return result.insertId;
        } else {
            Signal.#ii("Error: Failed to insert signal d:" + datetime + " gid:" + group_id + " t:" + signal_type);
            throw new Error("Error when adding signal");
        }
    }


    /**
     * Updates a row in the signals table with the group id.
     * group_id is the same as the id
     * @param {number} id Id and Group id to set
     * @returns void
     * @throws Error in case of failure
     */
    static async #setGroup(id) {
        const query = "UPDATE signals SET group_id=? WHERE id=?;";
        const data = [id, id];
        const result = await pool.query(query, data);
        if (result.affectedRows == 1 && result.warningStatus == 0) {
            Signal.#dd("Set group id ok: " + id);
            return;
        } else {
            throw new Error("Error when setting group");
        }
    }

}
