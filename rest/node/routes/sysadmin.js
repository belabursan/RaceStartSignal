"use strict";
const express = require("express");
const Authenticator = require("../src/Auth.js");
const User = require("../src/User.js");
const SysAdmin = require("../src/SysAdmin.js");
const Validator = require("../src/Validator.js");

let router = express.Router();


router.use(async function (req, res, next) {
    console.log(req.url, "sysadmin@", Date.now());
    try {
        await Authenticator.authenticateToken(req.header('Authorization'), false, true);
        next();
    } catch (error) {
        console.log("User unauthorized: " + error.message);
        return res.status(401).send("Unauthorized");
    }
});

router.route("/race")
    .post(async (req, res) => {             // POST RACE
        try {
            const raceIn = Validator.validateNewRace(req.body);
            await SysAdmin.addRace(raceIn);
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when adding race: " + message);
            return res.status(code).send(message);
        }
    })
    .delete(async (req, res) => {               // DELETE RACE
        try {
            await SysAdmin.deleteRace(req.query.race_id);
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when deleting race: " + message);
            return res.status(code).send(message);
        }
    });


router.route("/startline")
    .get(async (req, res) => {              // GET START LINE(s)
        try {
            if (req.query.startline_id) {   // get specified start line
                const startLine = await SysAdmin.getStartLineById(req.query.startline_id);
                return res.status(200).send(startLine);
            } else {    // get all start lines
                const startLines = await SysAdmin.getStartLines();
                return res.status(200).send(startLines);
            }
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when getting start line: " + message);
            return res.status(code).send(message);
        }
    })
    .post(async (req, res) => {             // POST STARTLINE
        try {
            const startLine = Validator.validateStarLine(req.body);
            await SysAdmin.addStartLine(startLine);
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when adding startline: " + message);
            return res.status(code).send(message);
        }
    })
    .put(async (req, res) => {              // PUT START LINE
        try {
            const startLine = req.body;
            await SysAdmin.updateStartLineById(req.query.startline_id, startLine);
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when updating startline: " + message);
            return res.status(code).send(message);
        }
    })
    .delete(async (req, res) => {               // DELETE STARTLINE
        try {
            await SysAdmin.deleteStartLineById(req.query.startline_id);
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when deleting startline: " + message);
            return res.status(code).send(message);
        }
    });

router.route("/user/role")
    .put(async (req, res) => {             // POST USER ROLE
        try {
            await User.changeRole(req.body);
            return res.sendStatus(201);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when changing user role: " + message);
            return res.status(code).send(message);
        }
    });
    
router.route("/harbor")
    .post(async (req, res) => {             // POST HARBOR
        try {
            await SysAdmin.addHarbor(req.body);
            return res.sendStatus(201);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when adding: " + message);
            return res.status(code).send(message);
        }
    })
    .get(async (req, res) => {              // GET HARBOR(s)
        try {
            const harbors = await SysAdmin.getHarbors();
            return res.status(200).send(harbors);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when getting harbors: " + message);
            return res.status(code).send(message);
        }
    })
    .delete(async (req, res) => {               // DELETE HARBOR
        try {
            await SysAdmin.deleteHarbor(req.query.harbor_id);
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when deleting startline: " + message);
            return res.status(code).send(message);
        }
    });
    
module.exports = router;
