const DB = require('./db/mariadb.js');
let pool = DB.getConn();


module.exports = class SysAdmin {

    constructor() {
    }


    /**
     * Adds a new race to the db
     * @param {Json object from client} raceIn 
     */
    static async addRace(raceIn) {
        const header = raceIn.race_header;
        console.log("Adding new Race.");
        const query = "INSERT INTO `race` (race_name, description, start_line,\
            race_type, race_date, race_start_time, race_stop_time) VALUES(?, ?, ?, ?, ?, ?, ?);";
        const data = [
            header.name,
            raceIn.description,
            raceIn.start_line,
            raceIn.race_type,
            header.date,
            header.start_time,
            header.stop_time
        ];
        const result = await pool.query(query, data);
        if (!result || result.affectedRows !== 1) {
            throw new Error("ERROR500 - failed to add race");
        }
    }


    /**
     * Adds a start line to db
     * @param {StartLine object} startLine start line to add to db
     */
    static async addStartLine(startLine) {
        console.log("Adding new start line.");
        const query = "INSERT INTO `startline` \
        (startline_name, harbor_id, lon_start_flag, lat_start_flag, lon_signal_boat, \
            lat_signal_boat, lon_first_mark, lat_first_mark) VALUES(?, ?, ?, ?, ?, ?, ?, ?);";
        const data = [
            startLine.startline_name,
            startLine.harbor_id,
            startLine.position_start_flag.longitude,
            startLine.position_start_flag.latitude,
            startLine.position_signal_boat.longitude,
            startLine.position_signal_boat.latitude,
            startLine.position_first_mark.longitude,
            startLine.position_first_mark.latitude
        ];
        const result = await pool.query(query, data);
        if (!result || result.affectedRows !== 1) {
            throw new Error("ERROR500 - failed to add start line");
        }
    }


    /**
     * Deletes a race based on id
     * @param {Number} raceId Id of the race to delete
     * @return nothing
     * @throws Error if deletion failed
     */
    static async deleteRace(raceId) {
        const result = await pool.query("DELETE FROM `race` WHERE race_id=?;", [raceId]);
        if (!result || result.affectedRows < 1) {
            throw new Error("ERROR400 - Failed to delete race " + raceId);
        }
    }


    /**
     * Returns all start lines from db
     * @returns Array of start lines
     */
    static async getStartLines() {
        console.log("Getting all startlines.");
        return await pool.query("SELECT * FROM `startline`;");
    }


    /**
     * Returns a start line from db defined by id
     * @param {Number} startLineId 
     * @returns StartLine object 
     */
    static async getStartLineById(startLineId) {
        console.log("Getting startline " + startLineId);
        const query = "SELECT * FROM `startline` WHERE startline_id=?;";
        return await pool.query(query, [startLineId]);
    }


    /**
     * Deletes a startline from db
     * @param {Number} startLineId start line id
     */
    static async deleteStartLineById(startLineId) {
        console.log("Deleting startline " + startLineId);
        const query = "DELETE FROM `startline` WHERE startline_id = ?;";
        const result = await pool.query(query, [startLineId]);
        if (!result || result.affectedRows < 1) {
            throw new Error("ERROR400 - bad data when deleting start line");
        }
    }


    /**
     * Updates a start line
     * @param {Number} startLineId 
     * @param {Startline object} startLine 
     */
    static async updateStartLineById(startLineId, startLine) {
        console.log("Updating startline " + startLineId);
        const query = "UPDATE `startline` SET \
            startline_name = ?, harbor_id = ?, lon_start_flag = ?, lat_start_flag = ?, lon_signal_boat = ?, \
            lat_signal_boat = ?, lon_first_mark = ?, lat_first_mark = ? \
            WHERE startline_id=?;";
        const data = [
            startLine.startline_name,
            startLine.harbor_id,
            startLine.position_start_flag.longitude,
            startLine.position_start_flag.latitude,
            startLine.position_signal_boat.longitude,
            startLine.position_signal_boat.latitude,
            startLine.position_first_mark.longitude,
            startLine.position_first_mark.latitude,
            startLineId
        ];
        const result = await pool.query(query, data);
        if (!result || result.affectedRows < 1) {
            throw new Error("ERROR400 - bad data when updating start line");
        }
    }


    /**
     * Adds a harbor to the db
     * @param {HarborInfo object} harborInfo harbor to add
     */
    static async addHarbor(harborInfo) {
        console.log("Adding new harbor: " + harborInfo.harbor_name);
        const query = "INSERT INTO `harbor` (harbor_name, city) VALUES (?, ?);"
        const data = [harborInfo.harbor_name, harborInfo.city];
        const result = await pool.query(query, data);
        if (!result || result.affectedRows !== 1) {
            throw new Error("ERROR500 - failed to add harbor");
        }

    }


    /**
     * Deleting a harbor from db
     * @param {Number} harborId Harbor id
     */
    static async deleteHarbor(harborId) {
        console.log("Deleting harbor " + harborId);
        const query = "DELETE FROM `harbor` WHERE harbor_id = ?;";
        const result = await pool.query(query, [harborId]);
        if (!result || result.affectedRows < 1) {
            throw new Error("ERROR400 - bad data when deleting harbor");
        }
    }


    /**
     * Returns all harbors from the db
     * @returns Harbors as list or empty list
     */
    static async getHarbors() {
        console.log("Getting all harbors");
        return await pool.query("Select * FROM `harbor`;");
    }

}
