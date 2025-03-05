const DB = require('./db/mariadb.js');
const User = require("./User.js");
const Race = require("./Race.js");
const Enums = require("./Enums.js");
const Participants = require('./Participants.js');
const Time = require('./Time.js');
const RaceResult = require('./RaceResult.js');

let pool = DB.getConn();
const debug = process.env.DEBUG === "true";


module.exports = class Admin {

    constructor() {
    }


    /**
     * Saves the result to the db
     * @param {Array of RaceResult} resultList List of result
     * @param {Number} race_id Id of the race
     */
    static async saveResult(resultList, race_id) {
        if (resultList && resultList.length > 0) {
            console.log("Saving result to db");
            const queryDelete = "DELETE FROM `result` WHERE race_id = ? \
          AND EXISTS(SELECT 1 FROM `result` WHERE race_id = ? LIMIT 1)";

            const columns = "race_id, point, status, skipper_name, boat_name, boat_type,\
        sail_number, elapsed_time, corrected_time, time_behind, srs_used";

            let queryInsert = "INSERT INTO `result` (" + columns + ") VALUES ";

            for (let i = 0; i < resultList.length; i++) {
                const r = resultList[i];
                queryInsert += "(" + r.toDbString() + ")";
                if ((i + 1) >= resultList.length) {
                    queryInsert += ";"
                } else {
                    queryInsert += ", ";
                }
            }
            await pool.query(queryDelete, [race_id, race_id]);
            const result = await pool.query(queryInsert);
            if (result.affectedRows != resultList.length) {
                console.log(result);
                throw new Error("ERROR500 - could not insert race result");
            }
        } else {
            console.log("resultList is empty");
        }
    }


    /**
     * Changes a role for an user
     * @param {RoleInfo} role Role to set, can be ADMIN and USER
     */
    static async setRole(role) {
        console.log("Setting admin role.");
        return await User.changeRole(role);
    }


    /**
     * Sets the course and wind info for a race
     * @param {CourseInfo object} courseInfo Holds the wind and course info
     * @param {Number} user_id User id
     * @returns
     */
    static async setCourseAndWind(courseInfo, user_id) {
        if (debug) console.log("Setting race course.");
        return await Race.setCourseAndWind(courseInfo, user_id);
    }


    /**
     * Setts the status of a race
     * @param {StatusInfo object} statusInfo containing the status and race id
     * @returns
     */
    static async updateRaceStatus(statusInfo) {
        if (debug) console.log("Setting race status.");
        return await Race.updateRaceStatus(statusInfo);
    }


    /**
     * Helper function for sort, compares two RaceResult objects
     * @param {RaceResult object} a 
     * @param {RaceResult object} b 
     * @returns -1 if a is bigger than b
     */
    static compareRaceResult(a, b) {
        let acs = a.getCorrectedSecs();
        let bcs = b.getCorrectedSecs();

        if (acs == null && bcs == null) {
            let ast = a.getStatus();
            let bst = b.getStatus();
            if (ast == bst) {
                return 0;
            }
            if (ast == Enums.RACE_STATUS.DNF) {
                return -1;
            }
            return 1;
        }
        if (acs != null && bcs == null) {
            return -1;
        }
        if (acs == null && bcs != null) {
            return 1;
        }
        if (acs < bcs) {
            return -1;
        }
        if (acs > bcs) {
            return 1;
        }
        return 0;
    }


    /**
     * Counts the elapsed and corrected time
     * @param {List of participants} participants from db
     * @param {Race object} race race
     * @returns list of RaceResult objects
     */
    static correctTimeAndSetPoints(participants, race) {
        let resultList = [];
        const noofParticipants = participants.length;
        for (let i = 0; i < noofParticipants; i++) {
            let r = new RaceResult(participants[i]);
            r.correctTimes(race.race_start_time, race.race_stop_time, noofParticipants);
            r.countTimes(race.race_start_time);
            resultList.push(r);
        }

        resultList.sort(this.compareRaceResult);
        for (let i = 0; i < noofParticipants; i++) {
            const r = resultList[i];
            const s = r.getStatus();
            if (s == Enums.RACE_STATUS.SAF || s == Enums.RACE_STATUS.ZFP) {
                r.setPoint(i + 1);
            } else if (s == Enums.RACE_STATUS.DNF) {
                r.setPoint(noofParticipants + 1);
            }
        }
        return resultList;
    }


    /**
     * Sets finished status and returns the race 
     * @param {Number} race_id Id of the race
     * @returns race by id
     */
    static async handleRace(race_id) {
        const race = await Race.getRaceById(race_id, true);
        //console.log(race);
        if (!race) {
            throw new Error("ERROR400 - race not found");
        }
        if (race.status === Enums.STATUS.ABORTED) {
            throw new Error("ERROR405 - race aborted");
        } else if (race.status === Enums.STATUS.CREATED) {
            throw new Error("ERROR405 - race not started");
        } else if (race.status !== Enums.STATUS.FINISHED) {
            // it must be JOINABLE, COURSE_SET, FIVE_MIN, FOUR_MIN, ONE_MIN, STARTED
            if (!Time.hasDatePassed(race.race_date, race.race_stop_time)) {
                throw new Error("ERROR405 - race not finished");
            } else {
                if (race.status !== Enums.STATUS.FINISHED) {
                    await Race.updateRaceStatus({ "status": Enums.STATUS.FINISHED, "race_id": race_id });
                }
            }
        }
        return race;
    }

    /**
     * Sets time behind
     * @param {List of RaceResult} resultList 
     */
    static setTimeBehind(resultList) {
        let beforeCorr = 0;
        let thisCor = 0;
        for (let i = 0; i < resultList.length; i++) {
            let r = resultList[i];
            thisCor = r.getCorrectedSecs();
            if (thisCor == null) {
                break;
            }
            if (i == 0) {
                r.setTimeBehind("00:00:00");
            } else {
                r.setTimeBehind(Time.secondsToTime(thisCor - beforeCorr));
            }
            beforeCorr = thisCor;
        }
    }


    /**
     * Counts the result for a race
     * @param {Number} race_id Id of race to count the result for
     */
    static async countResult(race_id) {
        console.log("Counting result for race " + race_id);
        const race = await Admin.handleRace(race_id);
        const participants = await Participants.getParticipants(race_id);
        const resultList = Admin.correctTimeAndSetPoints(participants, race);
        Admin.setTimeBehind(resultList);
        await Admin.saveResult(resultList, race_id);
    }

}
