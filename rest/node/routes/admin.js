"use strict";
const Admin = require("../src/Admin.js");
const Validator = require("../src/Validator.js");
const Authenticator = require("../src/Auth.js");
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
    .route("/user/role")
    .put(async (req, res) => {
        try {
            await Admin.setRole(Validator.validateRole(req.body, false));
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when changing user role: " + message);
            return res.status(code).send(message);
        }
    });

router
    .route("/race/status")
    .put(async (req, res) => {
        try {
            await Admin.updateRaceStatus(Validator.validateRaceStatus(req.body));
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when changing race status: " + message);
            return res.status(code).send(message);
        }
    });

router
    .route("/course")
    .post(async (req, res) => {
        const userid = res.app.locals.sr_auth.userId;
        try {
            await Admin.setCourseAndWind(Validator.validateCourse(req.body), userid);
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when setting course: " + message);
            return res.status(code).send(message);
        }
    });

router
    .route("/race/result")
    .post(async (req, res) => {
        try {
            await Admin.countResult(req.query.race_id);
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when counting race result: " + message);
            return res.status(code).send(message);
        }
    });


module.exports = router;
