const DB = require('./db/mariadb.js');
const Season = require("./Season.js");
const Enums = require("./Enums.js");
const SeasonResultLine = require("./SeasonResultLine.js");

let pool = DB.getConn();
const debug = process.env.DEBUG === "true";

module.exports = class SeasonResult {
    #season_id;
    #season_name;
    #season_description;
    #season_start;
    #season_end;
    #lines;


    /**
     * Construktor
     * @param {Number} season_id Season id
     */
    constructor(season_id) {
        this.#season_id = season_id;
        this.#lines = [];
        if (debug) console.log("New SeasonResult: " + season_id);
    }


    /**
     * Returns the string representation of this object
     */
    toJSON() {
        return {
            season_id: this.#season_id,
            season_name: this.#season_name,
            season_description: this.#season_description,
            season_start: this.#season_start,
            season_end: this.#season_end,
            lines: this.#lines
        };
    }


    /**
     * Checks if result is  in outList
     * @param {Array} outList 
     * @param {Result} result 
     * @returns true if result is in outList, false otherwise
     */
    #inList(outList, result) {
        for (let i = 0; i < outList.length; i++) {
            const tmp = outList[i];
            if ((tmp.boat_name == result.boat_name) &&
                (tmp.boat_type == result.boat_type) &&
                (tmp.sail_number == result.sail_number)) {
                return true;
            }
        }
        return false;
    }


    /**
     * Returns a list of all participants in this season
     * @param {Array} results Array of all results from this season
     * @returns Array of participants
     */
    #getListOfParticipants(results) {
        console.log("Getting list of participants");
        let out = [];

        for (let i = 0; i < results.length; i++) {
            const r = results[i];
            //console.log(r);
            if (!this.#inList(out, r)) {
                out.push({
                    "skipper": r.skipper_name,
                    "boat_name": r.boat_name,
                    "boat_type": r.boat_type,
                    "sail_number": r.sail_number
                });
            }
        }
        return out;
    }


    /**
     * Sets the season info for this season
     */
    async #setSeason() {
        const query = "SELECT * FROM `season` WHERE season_id = ?;";
        const seasons = await pool.query(query, [this.#season_id]);
        if (seasons && seasons.length > 0) {
            const season = seasons[0];
            this.#season_name = season.season_name;
            this.#season_description = season.season_description;
            this.#season_start = season.season_start;
            this.#season_end = season.season_end;
            console.log("Setting season values for season : " + this.#season_name);
        } else {
            throw new Error("ERROR400 - season " + this.#season_id + " not found");
        }
    }


    /**
     * Returns the race ids included in a season defined by the parameter
     * @param {Number} season_id Id of a season
     * @returns race ids as array
     */
    async #getRaceIdsForSeason(season_id) {
        const query = "SELECT race_id FROM season_data \
                WHERE season_id = ? ORDER BY race_id ASC;";
        const race_ids = await pool.query(query, [season_id]);
        let out = [];
        for (let i = 0; i < race_ids.length; i++) {
            out.push(race_ids[i].race_id);
        }
        return out;
    }


    /**
     * Counts the total for the season
     *@param {Array} results list of results for all races in this season from db  
     */
    async count(results) {
        console.log("Counting result for " + this.#season_id);
        await this.#setSeason();
        const race_ids = await this.#getRaceIdsForSeason(this.#season_id);
        if (race_ids && race_ids.length > 0) {
            const listOfParticipants = this.#getListOfParticipants(results);
            if (listOfParticipants && listOfParticipants.length > 0) {
                for (let i = 0; i < listOfParticipants.length; i++) {
                    let r = new SeasonResultLine(listOfParticipants[i], race_ids, results);
                    this.#lines.push(r);
                    if (debug) console.log(JSON.stringify(r));
                }
            } else {
                console.log("No participants in this season");
            }
        } else {
            console.log("No races in this season");
        }
    }

}
