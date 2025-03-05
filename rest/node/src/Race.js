const Participants = require('./Participants.js');
const Enums = require("./Enums.js");
const DB = require('./db/mariadb.js');
const Time = require("./Time.js");
let pool = DB.getConn();

const debug = process.env.DEBUG === "true";
const NODE_STRICT_JOIN = process.env.NODE_STRICT_JOIN === "true";


module.exports = class Race {

    constructor() {
    }


    /**
     * Converts a db result to a json string
     * @param {DB result} result data set from db
     * @returns race as json string
     */
    static raceResultToJsonString(result) {
        return JSON.stringify({
            race_header: {
                race_id: result.race_id,
                name: result.race_name,
                date: result.race_date,
                start_time: result.race_start_time,
                stop_time: result.race_stop_time
            },
            race_details: {
                description: result.description,
                course: result.race_course,
                status: result.status,
                race_type: result.race_type,
                wind_direction: result.wind_direction,
                wind_strength: result.wind_strength,
                course_set_by: result.race_set_by
            },
            startline: {
                startline_name: result.startline_name,
                harbor: result.harbor,
                position_start_flag: {
                    lonngitude: result.lon_start_flag,
                    latitude: result.lat_start_flag
                },
                position_signal_boat: {
                    longitude: result.lon_signal_boat,
                    latitude: result.lat_signal_boat
                },
                position_first_mark: {
                    longitude: result.lon_first_mark,
                    latitude: result.lat_first_mark
                }
            }
        });
    }


    /**
     * Returns race headers from db
     * @param {String} harbor Harbor to search for
     * @param {Number} year Year to filter for
     * @returns All the race headers
     */
    static async getRaceHeaders(harbor, year) {
        let query = "";
        let data = [];

        if (harbor) {
            const _harbor_ = "%" + harbor + "%";
            if (year) {
                // harbor and year
                console.log("Getting races for year " + year + " and harbor " + harbor);
                query = "SELECT race_id, race_name, harbor_name, race_date, race_start_time, race_stop_time \
                    FROM race \
                    INNER JOIN startline ON startline.startline_id = race.start_line \
                    INNER JOIN harbor ON harbor.harbor_id = startline.harbor_id \
                    WHERE YEAR(race_date) = ? AND harbor LIKE ? \
                    ORDER BY race_date ASC;"
                data = [year, _harbor_];
            } else {
                //harbor only
                console.log("Getting races for harbor " + harbor);
                query = "SELECT race_id, race_name, harbor_name, race_date, race_start_time, race_stop_time \
                    FROM race \
                    INNER JOIN startline ON startline.startline_id = race.start_line \
                    INNER JOIN harbor ON harbor.harbor_id = startline.harbor_id \
                    WHERE harbor_name LIKE ? \
                    ORDER BY race_date ASC;"
                data = [_harbor_];
            }
        } else {
            if (year) {
                // year only
                console.log("Getting races for year " + year);
                query = "SELECT race_id, race_name, harbor_name, race_date, race_start_time, race_stop_time \
                    FROM race \
                    INNER JOIN startline ON startline.startline_id = race.start_line \
                    INNER JOIN harbor ON harbor.harbor_id = startline.harbor_id \
                    WHERE YEAR(race_date) = ? \
                    ORDER BY race_date ASC;"
                data = [year];
            } else {
                // all
                console.log("Getting all races.");
                return await pool.query("\
                    SELECT race_id, race_name, harbor_name, race_date, race_start_time, race_stop_time \
                    FROM `race` \
                    INNER JOIN startline ON startline.startline_id = race.start_line \
                    INNER JOIN harbor ON harbor.harbor_id = startline.harbor_id \
                    ORDER BY race_date ASC;");
            }
        }

        return await pool.query(query, data);
    }


    /**
     * Returns a full race information
     * @param {Number} raceId id to race to return
     */
    static async getRaceById(raceId, returnAsJsonObject = false) {
        const query = "SELECT * FROM race \
        JOIN startline ON startline.startline_id = race.start_line \
        WHERE race_id = ?;"
        const result = await pool.query(query, [raceId]);
        if (!result || result.length < 1) {
            throw new Error("ERROR400 - not found any race with id " + raceId);
        }
        if (returnAsJsonObject) {
            return result[0];
        }
        return Race.raceResultToJsonString(result[0]);
    }


    /**
     * Converts a status result to a json string
     * @param {DB result} result Result from db
     * @returns Status as string
     */
    static statusResultToJsonObject(result) {
        const time = Time.getTimeNow();
        return JSON.stringify({
            server_time: time,
            status: result.status,
            course: result.race_course
        });
    }


    /**
     * Returns the status of the race defined by race id
     * @param {Number} raceId Race id
     * @returns Status as json string
     */
    static async getStatusByRaceId(raceId) {
        console.log("Getting status of race " + raceId);
        const query = "SELECT status, race_course FROM race WHERE race_id = ?;"
        const result = await pool.query(query, [raceId]);
        if (!result[0]) {
            throw new Error("ERROR400 - race " + raceId + "not found");
        }
        return Race.statusResultToJsonObject(result[0]);
    }


    /**
     * Returns a list of all activ races where the
     * boat specified by the boat id is present
     * @param {Number} boatId boat id to search for
     * @returns list of RaceHeader-s
     */
    static async getJoinedRaces(boatId) {
        return await Participants.getJoinedRaces(boatId);
    }


    /**
     * Makes the caller join a race
     * @param {JoinInfo object} joinInfo object from the call
     * @param {Number} userId user id of the sender
     * @param {Number} boatId The boat id of the users boat
     */
    static async join(joinInfo, userId, boatId) {
        console.log("User " + userId + " wants to join race " + joinInfo.race_id);
        console.log("Strict join is set to: " + NODE_STRICT_JOIN);

        const race = await Race.getRaceById(joinInfo.race_id, true);
        const status = race.status;

        if ((status == Enums.STATUS.JOINABLE
            || status == Enums.STATUS.COURSE_SET
            || status == Enums.STATUS.FIVE_MIN)
            || ((NODE_STRICT_JOIN == 'false') && (status == Enums.STATUS.FOUR_MIN
                || status == Enums.STATUS.ONE_MIN
                || status == Enums.STATUS.STARTED))) {
            return await Participants.join(joinInfo, userId, boatId);
        } else {
            if (debug) console.log("Race is not joinable, throwing error. Status is: " + status);
            throw new Error("ERROR405 - not joinable, status is: " + status);
        }
    }


    /**
     * Removes a participant froom a race
     * @param {Number} raceId The id of the race
     * @param {Number} userId The id of the user
     * @param {Number} boatId The boat id of the users boat
     */
    static async exit(raceId, userId, boatId) {
        return await Participants.exit(raceId, userId, boatId);
    }


    /**
     * Sets a start time 
     * @param {TimeInfo object} timeInfo reported start time
     * @param {Number} boatId of the boat
     */
    static async reportStartTime(timeInfo, boatId) {
        return await Participants.reportStartTime(timeInfo, boatId);
    }


    /**
     * Sets a stop time
     * @param {TimeInfo object} timeInfo reported stop time
     * @param {Number} boatId of the boat
     */
    static async reportStopTime(timeInfo, boatId) {
        return await Participants.reportStopTime(timeInfo, boatId);
    }


    /**
     * Setts the status of a race
     * @param {StatusInfo object} statusInfo containing the status and race id
     * @returns
     */
    static async updateRaceStatus(statusInfo) {
        console.log("Updating race status to " + statusInfo.status);
        const query = "UPDATE `race` \
                    SET status = ? \
                    WHERE race_id = ?;";
        const data = [statusInfo.status, statusInfo.race_id];
        const result = await pool.query(query, data);
        if (result.affectedRows === 1) {
            console.log("Status set to: " + statusInfo.status);
        } else {
            console.log(result);
            console.log("STATUS NOT UPDATED");
            throw new Error("ERROR400 - race status not updated");
        }
    }


    /**
     * Sets the course and wind info for a race
     * @param {CourseInfo object} courseInfo Holds the wind and course info
     * @param {Number} user_id User id
     * @returns
     */
    static async setCourseAndWind(courseInfo, user_id) {
        console.log("Setting course and wind info");
        const query = "UPDATE `race` \
                    SET race_course = ? , wind_direction = ?, wind_strength = ?, race_set_by = ? \
                    WHERE race_id = ?;";
        const data = [courseInfo.course, courseInfo.wind_direction,
        courseInfo.wind_strength, user_id, courseInfo.race_id];
        const result = await pool.query(query, data);
        if (result.affectedRows === 1) {
            console.log("Course set to: " + courseInfo.course);
        } else {
            throw new Error("ERROR400 - Course not updated");
        }
    }


    /**
     * Returns the result for the race if it is finished
     * @param {Number} race_id Id of the race to return result for
     * @returns List of participants with result
     */
    static async getResultByRaceId(race_id) {
        console.log("Getting result for race " + race_id);
        const query = "SELECT * FROM `result` WHERE race_id = ?;";
        return await pool.query(query, [race_id]);
    }
}

// https://www.google.com/search?channel=fs&client=ubuntu-sn&q=sailing+race+start+line#fpstate=ive&vld=cid:a64665c6,vid:ttc7BAEziqs,st:0
