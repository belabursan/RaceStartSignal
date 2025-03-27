

module.exports = class Time {

    static StartSignal = 0;
    static OneMinSignal = 1;
    static FourMinSignal = 2;
    static FiveMinSignal = 3;



    /**
     * Returns an array of as needed for five series in db/web format
     * @returns an array of the time and the time 1, 4 and 5 minutes before
     */
    static getFiveSeriesTime(web_time) {
        var out = [];
        const t = web_time.split(/[- :]/);
        var loc_time = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));

        out.push(loc_time.toISOString().slice(0, 19).replace('T', ' '));    // start time
        loc_time.setMinutes(loc_time.getMinutes() - 1);
        out.push(loc_time.toISOString().slice(0, 19).replace('T', ' '));    // 1 min before
        loc_time.setMinutes(loc_time.getMinutes() - 3);
        out.push(loc_time.toISOString().slice(0, 19).replace('T', ' '));    // 4 min before
        loc_time.setMinutes(loc_time.getMinutes() - 1);
        out.push(loc_time.toISOString().slice(0, 19).replace('T', ' '));    // 5 min before
        return out;
    }

    /**
     * Pads a singel digit with zero
     * @param {Number} number Number to pad
     * @returns The number padded with zero
     */
    static pad(number) {
        if (!number) {
            return "00";
        }
        return String(number).padStart(2, '0');
    }

    /**
     * Returns the current time
     * @returns time as string in hh:mm:ss format
      */
    static getTimeNow() {
        const currentdate = new Date();
        const time = Time.pad(currentdate.getHours()) + ":" +
            Time.pad(currentdate.getMinutes()) + ":" + Time.pad(currentdate.getSeconds());
        return time;
    }

}
