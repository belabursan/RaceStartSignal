"use strict";
const Authenticator = require("../src/Auth.js");
const Validator = require("../src/Validator.js");
const Race = require("../src/Race.js");
const express = require("express");
let router = express.Router();


router.use(async function (req, res, next) {
    console.log(req.url, "@", Date.now());
    try {
        const auth = await Authenticator.authenticateToken(req.header('Authorization'), false, false);
        res.app.locals.sr_auth = auth;
        next();
    } catch (error) {
        console.log("User unauthorized: " + error.message);
        return res.status(401).send("Unauthorized");
    }
});

router
    .route("/headers")
    .get(async (req, res) => {          // GET RACE HEADERS
        try {
            const harbor = req.query.harbor;
            const year = req.query.year;
            const races = await Race.getRaceHeaders(harbor, year);
            return res.status(200).send(races);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when getting race headers: " + message);
            return res.status(code).send(message);
        }
    });

router
    .route("/")
    .get(async (req, res) => {        // GET RACE <-id
        try {
            const race = await Race.getRaceById(req.query.race_id);
            return res.status(200).send(race);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when getting race: " + message);
            return res.status(code).send(message);
        }
    });

router
    .route("/joined")
    .get(async (req, res) => {              // JOINED
        try {
            const races = await Race.getJoinedRaces(res.app.locals.sr_auth.boatId);
            return res.status(200).send(races);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when getting joined races: " + message);
            return res.status(code).send(message);
        }
    });

router
    .route("/join")
    .post(async (req, res) => {             // JOIN
        try {
            await Race.join(
                req.body,
                res.app.locals.sr_auth.userId,
                res.app.locals.sr_auth.boatId);
            return res.sendStatus(201);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when joining race: " + message);
            return res.status(code).send(message);
        }
    });

router
    .route("/exit")
    .post(async (req, res) => {             // EXIT
        try {
            await Race.exit(
                req.query.race_id,
                res.app.locals.sr_auth.userId,
                res.app.locals.sr_auth.boatId)
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when exiting race: " + message);
            return res.status(code).send(message);
        }
    });

router
    .route("/status")
    .get(async (req, res) => {        // GET RACE STATUS
        try {
            const status = await Race.getStatusByRaceId(req.query.race_id);
            return res.status(200).send(status);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when getting status: " + message);
            return res.status(code).send(message);
        }
    });

router
    .route("/report/starttime")
    .post(async (req, res) => {             // REPORT STARTTIME
        try {
            await Race.reportStartTime(req.body, res.app.locals.sr_auth.boatId);
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when reporting start time: " + message);
            return res.status(code).send(message);
        }
    });

router
    .route("/report/stoptime")
    .post(async (req, res) => {             // REPORT STOPTIME
        try {
            await Race.reportStopTime(req.body, res.app.locals.sr_auth.boatId);
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when reporting stop time: " + message);
            return res.status(code).send(message);
        }
    });

    router
    .route("/result")
    .get(async (req, res) => {        // GET RACE RESULT
        try {
            const result = await Race.getResultByRaceId(req.query.race_id);
            return res.status(200).send(result);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when getting race result: " + message);
            return res.status(code).send(message);
        }
    });

module.exports = router;

// https://stackoverflow.com/questions/59072034/how-can-i-parse-parameters-to-a-restful-api
// http://expressjs.com/en/api.html#req.query
