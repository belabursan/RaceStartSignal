const DB = require('./db/mariadb.js');
const Time = require('./Time.js');
const { SIGNAL_TYPE } = require('./Enums.js');

let pool = DB.getConn();
const debug = process.env.DEBUG === "true";

module.exports = class Signal {

    /**
     * Returns all signals from the database
     * @returns all signals as a list
     */
    static async getSignals() {
        console.log("Getting all signals");
        const result = await pool.query("SELECT id, group_id, signal_type, DATE_FORMAT(date_time,'%Y-%m-%d %T') AS date_time FROM signals ORDER BY date_time ASC;");
        //console.log(result);
        return result;
    }

    /**
     * Inserts a new signal into the database
     * @param {JSON} signal data from web
     */
    static async addSignal(signal) {
        const id = -1;
        const times = Time.getFiveSeriesTime(signal.date_time, signal.five_min_serie, signal.yellow_flag);
        console.log("Adding signal at: " + times[Time.StartSignal] + " ("+signal.five_min_serie+"-"+signal.yellow_flag+")");
        try {
            await pool.query('START TRANSACTION;');
            id = await Signal.#insert(times[Time.StartSignal], 0, SIGNAL_TYPE.StartSignal);
            await Signal.#setGroup(id);
            if (signal.five_min_serie === true) {
                if(debug) console.log("Adding five min signals");
                await Signal.#insert(times[Time.OneMinSignal], id, SIGNAL_TYPE.OneMinSignal);
                await Signal.#insert(times[Time.FourMinSignal], id, SIGNAL_TYPE.FourMinSignal);
                await Signal.#insert(times[Time.FiveMinSignal], id, SIGNAL_TYPE.FiveMinSignal);
                if (signal.yellow_flag === true) {
                if(debug) console.log("Adding yellow flag signal");
                    await Signal.#insert(times[Time.YellowSignal], id, SIGNAL_TYPE.YellowFlag);
                }
            }
            await pool.query('COMMIT;');
        } catch (error) {
            await pool.query('ROLLBACK;');
            throw new Error("ERROR 503: Error when adding signal");
        }
        console.log("Signals added successfully");
        return id;
    }


    /**
     * Deletes all the signals with the specified group id
     * @param {*} group_id 
     */
    static async deleteSignalByGroupId(group_id) {
        console.log("Deleting signals with group id: " + group_id);
        return await pool.query("DELETE FROM signals WHERE group_id=?;", [group_id]);
    }


    /**
     * Inserts a new signal into the database
     * @param {string} datetime Date and time of the signal
     * @param {*} group_id Group id of the signal
     * @param {*} signal_type Type of the signal
     * @returns row id of the inserted signal
     */
    static async #insert(datetime, group_id, signal_type) {
        console.log("Inserting signal: " + datetime);
        const query = "INSERT INTO signals (date_time, group_id, signal_type) VALUES(?, ?, ?);";
        const result = await pool.query(query, [datetime, group_id, signal_type]);
        if(result.affectedRows == 1 && result.warningStatus == 0) {
            if(debug) console.log("insert ok");
            return result.insertId;
        }
        console.log("Failed to insert signal " + datetime);
        throw new Error("Error when adding signal");
    }


    /**
     * Updates a row in the signals table with the group id.
     * group_id is the same as the id
     * @param {number} id Id and Group id to set
     * @returns the result of the query
     */
    static async #setGroup(id) {
        const query = "UPDATE signals SET group_id=? WHERE id=?;";
        const data = [id, id];
        const result = await pool.query(query, data);
        if(debug) console.log("Set group id: " + id);
        if(result.affectedRows == 1 && result.warningStatus == 0) {
            console.log("Set group id ok");
            return;
        }
        throw new Error("Error when setting group");
    }
}
