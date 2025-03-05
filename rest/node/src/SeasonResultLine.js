

module.exports = class SeasonResultLine {

    #skipper;
    #boat_name;
    #boat_type;
    #sail_number;
    #race_ids;
    #races;
    #total;
    #DEFAULT_RACE_POINT = 50;


    /**
     * Constructor
     * @param {Participant} participant Participant info
     * @param {Arrai} race_ids Array of race id-s in this season
     * @param {Array} results Array of race results
     */
    constructor(participant, race_ids, results) {
        this.#skipper = participant.skipper;
        this.#boat_name = participant.boat_name;
        this.#boat_type = participant.boat_type;
        this.#sail_number = participant.sail_number;
        this.#race_ids = race_ids;
        //
        this.#races = [];
        this.#total = 0;
        this.#setData(results)
    }


    /**
     * Check if the parameter result is for thid line
     * @param {RaceResult} result 
     * @returns true or false
     */
    #isResultForThisLine(result) {
        if ((result.boat_name == this.#boat_name) &&
            (result.sail_number == this.#sail_number) &&
            (result.boat_type == this.#boat_type)) {
            return true;
        }
        return false;
    }


    /**
     * Returns the index in the race_ids for this parameter
     * @param {RaceResult} race race to check index for
     * @returns index as integer or throws error if race not found
     */
    #getIndexForRace(race) {
        const index = this.#race_ids.indexOf(race.race_id);
        if (index < 0) {
            throw new Error("ERROR500 - race not found: " + race.race_id);
        }
        return index;
    }


    /**
     * Sets the race result for this line
     * @param {RaceResult} results race result to set to this line
     */
    #setData(results) {
        console.log("Setting data in new line: " + this.#boat_name);
        for (let i = 0; i < this.#race_ids.length; i++) {
            this.#races.push(this.#DEFAULT_RACE_POINT);
            this.#total += this.#DEFAULT_RACE_POINT;
        }
        for (let i = 0; i < results.length; i++) {
            const raceResult = results[i];
            if (this.#isResultForThisLine(raceResult)) {
                const index = this.#getIndexForRace(raceResult);
                this.#races[index] = raceResult.point;
                this.#total -= (this.#DEFAULT_RACE_POINT - raceResult.point);
            }
        }
    }


    /**
     * Returns this object as Json string
     * @returns string
     */
    toJSON() {
        return {
            skipper: this.#skipper,
            boat_name: this.#boat_name,
            boat_type: this.#boat_type,
            sail_number: this.#sail_number,
            total: this.#total,
            races: this.#races
        };
    }
}
