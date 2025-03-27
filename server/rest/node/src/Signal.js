const DB = require('./db/mariadb.js');
const { SIGNAL_TYPE } = require('./Enums.js');

let pool = DB.getConn();
const debug = process.env.DEBUG === "true";

module.exports = class Signal {

    /**
     * Returns all signals from the database
     * @returns all signals as a list
     */
    static async getSignals() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM signals";
            pool.query(query, (err, res) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(res);
            });
        });
    }

    /**
     * Inserts a new signal into the database
     * @param {JSON} signal data from web
     * @returns boolean True if succeeded, false otherwise
     */
    static async addSignal(signal) {
        const result = await Signal.#insert(signal.date_time, 0, SIGNAL_TYPE.StartSignal);
        if (result.affectedRows == 1 && result.warningStatus == 0) {
            const id = result.insertId;
            await Signal.#setGroup(id);

            console.log("Added signal with id: " + id);
            if (signal.five_min_serie) {
                await Signal.#insert(signal.date_time, id, SIGNAL_TYPE.OneMinSignal);
                await Signal.#insert(signal.date_time, id, SIGNAL_TYPE.FourMinSignal);
                await Signal.#insert(signal.date_time, id, SIGNAL_TYPE.FiveMinSignal);
            }
            return true;
        }
        return false;
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
     * @param {date_time} date_time Date and time of the signal
     * @param {*} group_id Group id of the signal
     * @param {*} signal_type Type of the signal
     * @returns boolean True if succeeded, false otherwise
     */
    static async #insert(date_time, group_id, signal_type) {
        let time = date_time;
        time.setMinutes(time.getMinutes() - signal_type);
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO signals (date_time, group_id, signal_type) VALUES(?, ?, ?);";
            let time = date_time;
            if (signal_type != 0) {
                time.setMinutes(time.getMinutes() - signal_type);
            }
            pool.query(query, [time, group_id, signal_type], (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(result);
            });
        });
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
        return result;
    }
}
