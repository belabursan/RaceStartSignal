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
        return await Signal.#getSignalsByGroupId();
        /*
        const query = "SELECT * FROM signals";
        const result = pool.query(query);
        return result;
        */
    }

    static async #getSignalsByGroupId() {
        var output = [];
        console.log("Getting signals by group id");
        const group_ids = await pool.query("SELECT group_id, COUNT(group_id) c FROM signals GROUP BY group_id HAVING c = 1");
        console.log(group_ids);
        group_ids.forEach(group_id => {
            var group = new Map();
            group.set("group_id", group_id);
            const signals = pool.query("SELECT date_time, signal_type FROM signals WHERE group_id=?", [group_id]);
            group.set("signals", signals);
            output.push(group);
        });
        JSON.stringify(output);
        return output;
    }

    /**
     * Inserts a new signal into the database
     * @param {JSON} signal data from web
     */
    static async addSignal(signal) {
        const times = Time.getFiveSeriesTime(signal.date_time);
        console.log("Adding signal at: " + times[Time.StartSignal] + " ("+signal.five_min_serie+")");
        const id = await Signal.#insert(times[Time.StartSignal], 0, SIGNAL_TYPE.StartSignal);
        if (id == -1) {
            throw new Error("Error when adding signal");
        }
        await Signal.#setGroup(id);
        if (signal.five_min_serie === true) {
            if(debug) console.log("Adding five min signals");
            var i = await Signal.#insert(times[Time.OneMinSignal], id, SIGNAL_TYPE.OneMinSignal);
            if (i == -1) {
                throw new Error("Error when adding one min signal");
            }
            i = await Signal.#insert(times[Time.FourMinSignal], id, SIGNAL_TYPE.FourMinSignal);
            if (i == -1) {
                throw new Error("Error when adding four min signal");
            }
            i = await Signal.#insert(times[Time.FiveMinSignal], id, SIGNAL_TYPE.FiveMinSignal);
            if (i == -1) {
                throw new Error("Error when adding five min signal");
            }
        }
        return id;
    }


    /**
     * Deletes all the signals with the specified group id
     * @param {*} group_id 
     */
    async deleteSignalByGroupId(group_id) {
        const query = "DELETE FROM signals WHERE group_id=?;";
        const result = await pool.query(query, [group_id], (err, res) => {
            if (err) {
                console.log(err);
                throw new Error("Error when deleting signal");
            }
            return res;
        });
        return result
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
            return result.insertId;
        }
        console.log("Failed to insert signal " + datetime);
        return -1;
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
        return result;
    }
}
