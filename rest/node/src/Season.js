const DB = require('./db/mariadb.js');
const Validator = require("./Validator.js");
const Race = require("./Race.js");
const SeasonResult = require("./SeasonResult.js");

let pool = DB.getConn();
const debug = process.env.DEBUG === "true";

module.exports = class Season {

    constructor() {
    }


    /**
     * Adds a race to a season
     * @param {Number} season_id Season id to add
     * @param {Number} race_id Race id to add
     */
    static async addRaceToSeason(season_id, race_id) {
        console.log("Adding race " + race_id + " to season " + season_id);
        const query = "INSERT INTO `season_data` (season_id, race_id) VALUES (?, ?);";
        const data = [season_id, race_id];
        const result = await pool.query(query, data);
        Validator.validateDbInsert(result);
    }


    /**
     * Deletes a season from db
     * @param {Number} season_id Id of season to delete
     */
    static async deleteSeason(season_id) {
        console.log("Deleting season " + season_id);
        const query = "DELETE FROM `season_data` WHERE season_id = ?;";
        let result = await pool.query(query, [season_id]);

        console.log("Deleted data, now deleting season");
        console.log(result);
        const query2 = "DELETE FROM `season` WHERE season_id = ?;";
        result = await pool.query(query2, [season_id]);
        Validator.validateDbDelete(result);
    }


    /**
     * Deletes a race from a season
     * @param {Number} season_id Season id to delete race from
     * @param {Number} race_id Race to delete from season
     */
    static async deleteRaceFromSeason(season_id, race_id) {
        console.log("Deleting race " + race_id + " from season " + season_id);
        const query = "DELETE FROM `season_data` WHERE (season_id = ? AND race_id = ?);";
        const data = [season_id, race_id];
        const result = await pool.query(query, data);
        Validator.validateDbDelete(result);
    }


    /**
     * Adds a new season to the database
     * @param {SeasonInfo object} seasonInfo Sent from client as json
     */
    static async addSeason(seasonInfo) {
        console.log("Adding new season");
        const query = "INSERT INTO `season` (season_name, season_description, season_start, season_end) \
                        VALUES (?, ?, ?, ?) RETURNING season_id;"
        const data = [seasonInfo.season_name, seasonInfo.season_description,
        seasonInfo.season_start, seasonInfo.season_end];
        let result = await pool.query(query, data);
        console.log("Added season header");

        const seasonId = result[0].season_id;
        const races = seasonInfo.race;
        let query2 = "INSERT INTO `season_data` (season_id, race_id) VALUES ";
        for (let i = 0; i < races.length; i++) {
            query2 += "(" + seasonId + ", " + races[i] + ")";
            if ((i + 1) >= races.length) {
                query2 += ";"
            } else {
                query2 += ", ";
            }
        }
        console.log("Adding season data: " + query2);
        result = await pool.query(query2);
        console.log(result);
    }


    /**
     * Returns the result for a race specified by the race id
     * @param {Number} race_id Id of the race to get result for
     * @returns a list of RaceResult object
     */
    static async getResultByRaceId(race_id) {
        return await Race.getResultByRaceId(race_id);
    }


    /**
     * Returns the results for a season
     * @param {Number} season_id Id of the season to return
     * @returns List of "result", see db table result
     */
    static async getResultBySeasonId(season_id) {
        console.log("Getting result by season id " + season_id);
        const query = "SELECT * FROM `result` WHERE race_id IN \
            (SELECT race_id FROM season_data WHERE season_id = ?);";
        const results = await pool.query(query, [season_id]);
        return results;
    }


    /**
     * Returns the total for the season
     * @param {Number} season_id Id of the season to return
     * @returns {SeasonResult object} Result "Total" for a season
     */
    static async getSeasonSummary(season_id) {
        console.log("Getting season summary for season " + season_id);
        const results = await Season.getResultBySeasonId(season_id);
        if (!results || results.length < 1) {
            console.log("No result for season " + season_id);
            return JSON.stringify([]);
        }
        const seasonResult = new SeasonResult(season_id);

        await seasonResult.count(results);

        const s = JSON.stringify(seasonResult);
        if (debug) console.log(s);
        return s;
    }


    /**
     * Get all seasons
     * @returns A list of seasons
     */
    static async getAllSeason() {
        console.log("Returning all seasons");

        let seasons = await pool.query("SELECT * FROM season;");
        if (seasons) {
            for (let i = 0; i < seasons.length; i++) {
                const id = seasons[i].season_id;
                const races = await pool.query("SELECT race_id FROM season_data WHERE season_id = ?;", [id]);
                let r = [];
                if (races) {
                    for (let j = 0; j < races.length; j++) {
                        r.push(races[j].race_id);
                    }
                }
                seasons[i].race = r;
            }
        }
        return seasons;
    }
}
