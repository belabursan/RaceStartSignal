const DB = require('./db/mariadb.js');
const Enums = require("./Enums.js");
const Race = require("./Race.js");
let pool = DB.getConn();

const debug = process.env.DEBUG === "true";


module.exports = class Participants {

    constructor() {
    }


    /**
     * Makes the caller join a race
     * @param {JoinInfo object} joinInfo object from the call
     * @param {Number} userId user id of the sender
     * @param {Number} boatId The boat id of the users boat
     */
    static async join(joinInfo, userId, boatId) {
        const raceId = joinInfo.race_id;
        console.log("Boat " + boatId + " joining race " + raceId);
        const query = "INSERT IGNORE INTO `participants` \
                        (race_id, boat_id, srs_type, status) \
                        VALUES (?, ?, ?, ?);";
        const data = [raceId, boatId, joinInfo.srs_type, Enums.RACE_STATUS.JOI];
        const result = await pool.query(query, data);
        if (result.affectedRows === 0 && result.warningStatus === 1) {
            if (debug) console.log(result);
            throw new Error("ERROR409 - Already joined");
        }
    }


    /**
     * Returns a list of all activ races where the
     * boat specified by the boat id is present and
     * race is not aborted or finished
     * @param {Number} boatId boat id to search for
     * @returns list of RaceHeader-s
     */
    static async getJoinedRaces(boatId) {
        console.log("Getting joined races");
        const query = "SELECT race.race_id, race.race_name, harbor_name, race.race_date, race.race_start_time, race.race_stop_time \
                    FROM race \
                    JOIN participants ON participants.race_id = race.race_id \
                    INNER JOIN startline ON startline.startline_id = race.start_line \
                    INNER JOIN harbor ON harbor.harbor_id = startline.harbor_id \
                    WHERE participants.boat_id = ? AND race.status != 'ABORTED' AND race.status != 'FINISHED' \
                    ORDER BY race.race_date ASC;"
        const result = await pool.query(query, [boatId]);
        return result;
    }


    /**
     * Set status for a participant in a race
     * @param {Number} raceId Id of the race
     * @param {Number} boatId Id of the boat
     * @param {Enums} race_status Status to set
     */
    static async setStatus(raceId, boatId, race_status) {
        console.log("Setting status " + race_status + " in race " + raceId + " on boat " + boatId);
        const query = "UPDATE `participants` \
            SET status = ? WHERE (race_id = ? AND boat_id = ?);";
        const data = [race_status, raceId, boatId];
        await pool.query(query, data);
    }


    /**
     * Removes a participant froom a race
     * @param {Number} raceId The id of the race
     * @param {Number} userId The id of the user
     * @param {Number} boatId The boat id of the users boat
     */
    static async exit(raceId, userId, boatId) {
        console.log("Exiting boat " + boatId + " from race " + raceId);
        const status = await Race.getStatusByRaceId(raceId);
        if (status === Enums.STATUS.STARTED) {
            console.log("Exit hit, setting DNF on boat " + boatId);
            await Participants.setStatus(raceId, boatId, Enums.RACE_STATUS.DNF);
        } else if (status !== Enums.STATUS.FINISHED) {
            console.log("Deleteing boat " + boatId + " from joined boats on race " + raceId);
            const query = "DELETE FROM `participants` WHERE (race_id = ? AND boat_id = ?);";
            const data = [raceId, boatId];
            const result = await pool.query(query, data);

            if (result.affectedRows === 0) {
                console.log(result);
                if (result.warningStatus === 0) {
                    throw new Error("ERROR400 - Row not found");
                }
            }
        } else {
            console.log("Race status is FINISHED, not doing anything");
        }
    }


    /**
     * Sets a start time 
     * @param {TimeInfo object} timeInfo reported start time
     * @param {Number} boatId of the boat
     */
    static async reportStartTime(timeInfo, boatId) {
        console.log("reporting start time for boat "
            + boatId + " in race " + timeInfo.race_id);
        const query = "UPDATE `participants` \
                        SET boat_start_time = ?, status = ? \
                        WHERE (race_id = ? AND boat_id = ?);";
        const data = [timeInfo.time, Enums.RACE_STATUS.SNF, timeInfo.race_id, boatId];
        const result = await pool.query(query, data);
        if (result.affectedRows === 0) {
            console.log(result);
            if (result.warningStatus === 0) {
                throw new Error("ERROR400 - Row not found");
            }
        }
    }


    /**
     * Sets a stop time
     * @param {TimeInfo object} timeInfo reported stop time
     * @param {Number} boatId of the boat
     */
    static async reportStopTime(timeInfo, boatId) {
        console.log("reporting stop time for boat "
            + boatId + " in race " + timeInfo.race_id);
        const query = "UPDATE `participants` \
                        SET boat_stop_time = ? \
                        WHERE (race_id = ? AND boat_id = ?);";
        const data = [timeInfo.time, timeInfo.race_id, boatId];
        const result = await pool.query(query, data);
        if (result.affectedRows === 0) {
            console.log(result);
            if (result.warningStatus === 0) {
                throw new Error("ERROR400 - Row not found");
            }
        }
    }


    /**
     * Returns the participants of a race wit boat info
     * @param {Number} race_id Id of race to return participants for
     * @returns List of participants
     */
    static async getParticipants(race_id) {
        console.log("Getting participants of race " + race_id);
        const columns = "participants.participants_id, participants.race_id, \
            participants.srs_type, participants.boat_start_time, participants.boat_stop_time, \
            participants.status, boat_info.type, boat_info.name, boat_info.sail_number, boat_info.skipper_name, \
            boat_info.srs_shorthand_no_flying,boat_info.srs_shorthand, boat_info.srs_no_flying, \
            boat_info.srs_default";
        const query = "SELECT " + columns + " \
                        FROM `participants` \
                        INNER JOIN boat_info ON participants.boat_id = boat_info.boat_id \
                        WHERE race_id = ?;";
        return await pool.query(query, [race_id]);
    }

}
