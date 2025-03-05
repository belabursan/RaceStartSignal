const Time = require("./Time.js");
const Enums = require("./Enums.js");

const DEFAULT_DNS_POINT = process.env.DEFAULT_DNS_POINT || 50;

module.exports = class RaceResult {
    #participants_id;
    #race_id;
    #srs_type;
    #status;
    #boat_start_time;
    #boat_stop_time;
    #type;
    #name;
    #sail_number;
    #skipper_name;
    #srs_shorthand_no_flying;
    #srs_shorthand;
    #srs_no_flying;
    #srs_default;
    //
    #falseStart;
    #elapsedSec;
    #elapsedTime;
    #correctedSec;
    #correctedTime;
    #point;
    #time_behind;


    /**
     * Constructor
     * @param {Patient info from db} participant 
     */
    constructor(participant) {
        this.#participants_id = participant.participants_id;
        this.#race_id = participant.race_id;
        this.#srs_type = participant.srs_type;
        this.#status = participant.status;
        this.#boat_start_time = participant.boat_start_time;
        this.#boat_stop_time = participant.boat_stop_time;
        this.#type = participant.type;
        this.#name = participant.name;
        this.#sail_number = participant.sail_number;
        this.#skipper_name = participant.skipper_name;
        this.#srs_shorthand_no_flying = participant.srs_shorthand_no_flying;
        this.#srs_shorthand = participant.srs_shorthand;
        this.#srs_no_flying = participant.srs_no_flying;
        this.#srs_default = participant.srs_default;
        this.#falseStart = false;
        this.#elapsedSec = null;
        this.#elapsedTime = null;
        this.#correctedTime = null;
        this.#correctedSec = null;
        this.#point = DEFAULT_DNS_POINT;
        this.#time_behind = 0;
    }


    /**
     * prints the values of the race result
     */
    print() {
        console.log("RR:\n\
            participant_id: " + this.#participants_id + "\n\
            race_id: "+ this.#race_id + "\n\
            srs_type: " + this.#srs_type + "\n\
            status: " + this.#status + "\n\
            boat_start_time: " + this.#boat_start_time + "\n\
            boat_stop_time: " + this.#boat_stop_time + "\n\
            type: " + this.#type + "\n\
            name: " + this.#name + "\n\
            sail_number: " + this.#sail_number + "\n\
            skipper_name: " + this.#skipper_name + "\n\
            srs_shorthand_no_flying: " + this.#srs_shorthand_no_flying + "\n\
            srs_shorthand: " + this.#srs_shorthand + "\n\
            srs_no_flying: " + this.#srs_no_flying + "\n\
            srs_default: " + this.#srs_default + "\n\
            elapsedSec: " + this.#elapsedSec + "\n\
            elapsedTime: " + this.#elapsedTime + "\n\
            correctedTime: " + this.#correctedTime + "\n\
            correctedSec: " + this.#correctedSec + "\n\
            point: " + this.#point + "\n\
            time_behind: " + this.#time_behind + "\n\
        ");
    }


    /**
     * Setter for time_behind
     * @param {Number} time time behind previous participant
     */
    setTimeBehind(time) {
        this.#time_behind = time;
    }


    /**
     * Getter for status
     * @returns status, see enum RACE_STATUS
     */
    getStatus() {
        return this.#status;
    }


    /**
     * Setter for point
     * @param {Number} point Point to set
     */
    setPoint(point) {
        this.#point = point;
    }


    /**
     * Getter for correctedSec
     * @returns the corrected seconds
     */
    getCorrectedSecs() {
        return this.#correctedSec;
    }


    /**
     * Returns the srs by type, type is taken from this.#srs_type
     * @returns srs as double
     */
    #getSrsByType() {
        switch (this.#srs_type) {
            case Enums.SRS_TYPE.SRS_NO_SPINNAKER:
                return this.#srs_no_flying;
            case Enums.SRS_TYPE.SRS_SHORTHAND:
                return this.#srs_shorthand;
            case Enums.SRS_TYPE.SRS_SHORTHAND_NO_SPINNAKER:
                return this.#srs_shorthand_no_flying;
            case Enums.SRS_TYPE.SRS_DEFAULT:
            default:
                return this.#srs_default;
        }
    }


    /**
     * Checks a time for null value
     * @param {Time} time Time to validate
     * @returns Time string, if parameter is null then "00:00:00" is returned
     */
    #validateTime(time) {
        if (!time) return "00:00:00";
        return time;
    }


    /**
     * Returns a string that can be used in a db insert
     * @returns string to use in db insert
     */
    toDbString() {
        return " " +
            this.#race_id + ", " +
            this.#point + ", '" +
            this.#status + "', '" +
            this.#skipper_name + "', '" +
            this.#name + "', '" +
            this.#type + "', '" +
            this.#sail_number + "', '" +
            this.#validateTime(this.#elapsedTime) + "', '" +
            this.#validateTime(this.#correctedTime) + "', '" +
            this.#validateTime(this.#time_behind) + "', '" +
            this.#getSrsByType() + "'";
    }


    /**
     * Corrects the start and end time of this participant,
     * sets correct status if needed
     * @param {Time in hh:mm:ss format} raceStartTime The race start time
     * @param {Time in hh:mm:ss format} raceEndTime The race end time
     * @param {Number} noofParticipants Number of participants
     */
    correctTimes(raceStartTime, raceEndTime, noofParticipants) {
        if (!this.#boat_start_time) {
            // boat not reported start time, set DNS
            this.#status = Enums.RACE_STATUS.DNS;
            this.#point = DEFAULT_DNS_POINT;
            console.log("No start time, setting DNS for " + this.#participants_id);
        } else {
            // start time ok, check end time
            if (!this.#boat_stop_time) {
                // no end time, set DNF
                this.#status = Enums.RACE_STATUS.DNF;

            } else {
                // start and end time present, check for false start 
                if (Time.compare(this.#boat_start_time, raceStartTime) < 0) {
                    console.log("Warning: False start!! for " + this.#participants_id);
                    //false start
                    this.#falseStart = true;
                    this.#status = Enums.RACE_STATUS.ZFP;   // 20% penalty under rule 30.2
                    this.#boat_start_time = raceStartTime;
                }
                // check if boat missed the end
                if (Time.compare(this.#boat_stop_time, raceEndTime) > 0) {
                    //boat finished after the race was ended, set DNF
                    this.#status = Enums.RACE_STATUS.DNF;
                    this.#point = noofParticipants + 1;
                    console.log("No end time for for " + this.#participants_id + ", setting DNF");
                } else {
                    if (!this.#falseStart) {
                        console.log("SAF for " + this.#participants_id);
                        this.#status = Enums.RACE_STATUS.SAF;
                    }
                }
            }
        }
    }


    /**
     * Coounts the elapsed and corrected times
     * @param {Time} raceStartTime Start time of the race
     */
    countTimes(raceStartTime) {
        if (this.#status === Enums.RACE_STATUS.SAF || this.#status === Enums.RACE_STATUS.ZFP) {
            this.#elapsedSec = Time.getElapsedTime(raceStartTime, this.#boat_stop_time);
            console.log("Elapsed seconds for " + this.#participants_id + " is: " + this.#elapsedSec);
            this.#elapsedTime = Time.secondsToTime(this.#elapsedSec);
            let corrected = this.#elapsedSec;

            const srs = this.#getSrsByType();
            corrected *= srs;

            if (this.#status === Enums.RACE_STATUS.ZFP) {
                console.log("False start, appending 20%");
                corrected *= 1.2;
            }
            this.#correctedSec = Math.floor(corrected);
            this.#correctedTime = Time.secondsToTime(this.#correctedSec);
        }
    }


}
