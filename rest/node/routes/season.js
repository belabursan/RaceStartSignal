"use strict";
const Validator = require("../src/Validator.js");
const Authenticator = require("../src/Auth.js");
const Season = require("../src/Season.js");
const express = require("express");
let router = express.Router();

router.use(async function (req, res, next) {
    try {
        const auth = await Authenticator.authenticateToken(
            req.header('Authorization'), true, false);
        res.app.locals.sr_auth = auth;
        next();
    } catch (error) {
        console.log("User unauthorized: " + error.message);
        return res.status(401).send("Unauthorized");
    }
});

router
    .route("/")
    .get(async (req, res) => {               // GET SEASON
        try {
            const seasons = await Season.getAllSeason();
            return res.status(200).send(seasons);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when getting all seasons: " + message);
            return res.status(code).send(message);
        }
    })
    .delete(async (req, res) => {               // DELETE SEASON
        try {
            await Season.deleteSeason(req.query.season_id);
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when deleting season: " + message);
            return res.status(code).send(message);
        }
    })
    .post(async (req, res) => {              // POST ADD SEASON
        try {
            await Season.addSeason(Validator.validateSeason(req.body));
            return res.sendStatus(201);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when adding new season: " + message);
            return res.status(code).send(message);
        }
    });

router
    .route("/summary")
    .get(async (req, res) => {              // GET SEASON SUMMARY
        try {
            const season = await Season.getSeasonSummary(req.query.season_id);
            return res.status(200).send(season);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when getting season: " + message);
            return res.status(code).send(message);
        }
    });

router
    .route("/update")
    .post(async (req, res) => {             // POST SEASON UPDATE
        try {
            const season_id = req.query.season_id;
            const race_id = req.query.race_id
            await Season.addRaceToSeason(season_id, race_id);
            return res.sendStatus(201);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when adding new race to season: " + message);
            return res.status(code).send(message);
        }
    })
    .delete(async (req, res) => {               // DELETE SEASON UPDATE
        try {
            const season_id = req.query.season_id;
            const race_id = req.query.race_id
            await Season.deleteRaceFromSeason(season_id, race_id);
            return res.sendStatus(201);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when adding new race to season: " + message);
            return res.status(code).send(message);
        }
    });

router
    .route("/race")
    .get(async (req, res) => {              // GET RACE RESULT
        try {
            const result = await Season.getResultByRaceId(req.query.race_id);
            return res.status(200).send(result);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when getting race for season: " + message);
            return res.status(code).send(message);
        }
    });

module.exports = router;
