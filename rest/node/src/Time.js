

module.exports = class Time {


    /**
     * Constructor
     */
    constructor() {
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


    /**
     * Compares two times
     * @param {Time} time1 
     * @param {Time} time2 
     * @returns -1 if time 1 is less, 0 if equal, 1 otherwise
     */
    static compare(time1, time2) {
        console.log("Comparing time " + time1 + " with " + time2);
        if (time1 < time2) {
            return -1;
        } else if (time1 === time2) {
            return 0;
        }
        return 1;
    }


    /**
     * Checks if the time is in the past or future
     * @param {Time} time 
     * @returns True if the time is in the past, false otherwise
     */
    static hasTimePassed(time) {
        console.log("Checking if time " + time + " has passed");
        const now = Time.getTimeNow();
        const ret = Time.compare(now, time);
        if (ret <= 0) {
            return false;
        }
        return true;
    }


    /**
     * Checks if a date has passed, not checking time
     * @param {Date} date Date to check if it has passed
     * @param {Time} time time to check
     * @returns true if date is after or same as current date, false otherwise
     */
    static hasDatePassed(date, time) {
        const s = date.getFullYear() + "-" + Time.pad(date.getMonth() + 1) + "-" + Time.pad(date.getDate());
        console.log("Checking if " + s + " has passed");
        const currentdate = new Date();
        const dateToCheck = new Date(`${s}T${time}Z`);

        return (dateToCheck <= currentdate);
    }


    /**
     * Converts a time in seconds to time form
     * @param {Number} sec time in seconds 
     * @returns time in hh:mm:ss form
     */
    static secondsToTime(sec) {
        const ss = Math.floor(sec) % 60;
        const mm = Math.floor(sec / 60) % 60;
        const hh = Math.floor(sec / 60 / 60);

        return "" + Time.pad(hh) + ":" + Time.pad(mm) + ":" + Time.pad(ss);
    }


    /**
     * Returns the time difference between two times
     * @param {Time} startTime Start time of the boat on the race
     * @param {Time} stopTime End time of the boat on the race
     * @returns time difference between start and stop time in seconds
     */
    static getElapsedTime(startTime, stopTime) {
        console.log("Counting elapsed time between " + startTime + " and " + stopTime);
        //https://stackoverflow.com/questions/1787939/check-time-difference-in-javascript
        const start = new Date(`2024-01-01T${startTime}Z`);
        const end = new Date(`2024-01-01T${stopTime}Z`);

        // the following is to handle cases where the times are on the opposite side of
        // midnight e.g. when you want to get the difference between 9:00 PM and 5:00 AM
        if (end < start) {
            end.setDate(end.getDate() + 1);
        }
        const diffSec = Math.floor((end - start) / 1000);
        console.log("diffSec: " + diffSec);
        return diffSec;
    }

}
