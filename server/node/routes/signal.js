"use strict";
const express = require("express");
const Authenticator = require("../src/Auth.js");
const ErrorHandler = require("../src/ErrorHandler.js");
const Signal = require("../src/Signal.js");
const Validator = require("../src/Validator.js");

let router = express.Router();


router.use(async function (req, res, next) {
    console.log(req.url, "signal@", Date.now());
    try {
        await Authenticator.authenticateToken(req.header('Authorization'), false, true);
        next();
    } catch (error) {
        console.log("User unauthorized: " + error.message);
        return res.status(401).send("Unauthorized");
    }
});


router.route("/")
    .post(async (req, res) => {             // Adds a SIGNAL
        try {
            const signal = req.body;
            Validator.validateSignal(signal)
            const group_id = await Signal.addSignal(signal);
            console.log("Signal added with group id: " + group_id);
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = ErrorHandler.handleError(error);
            console.log("Error when adding signal: " + message);
            return res.status(code).send(message);
        }
    })
    .get(async (req, res) => {              // GET SIGNALS(s)
        try {
            console.log("Getting signal");
            if (req.query.filter) {       // get specified signal
                console.error("Not yet implemented");
                return res.status(500).send("Not yet implemented");
            } else {                        // get all signals
                const signals = await Signal.getSignals();
                return res.status(200).send(signals);
            }
        } catch (error) {
            const { code, message } = ErrorHandler.handleError(error);
            console.log("Error when getting signal: " + message);
            return res.status(code).send(message);
        }
    })
    .delete(async (req, res) => {               // DELETE SIGNAL by GROUP ID
        try {
            await Signal.deleteSignalByGroupId(req.query.id);
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = ErrorHandler.handleError(error);
            console.log("Error when deleting signal: " + message);
            return res.status(code).send(message);
        }
    });

module.exports = router;
