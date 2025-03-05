"use strict";
const express = require("express");
const Boat = require("../src/Boat.js");
const User = require("../src/User.js");
const Validator = require("../src/Validator.js");
const Authenticator = require("../src/Auth.js");

let router = express.Router();
const debug = process.env.DEBUG === "true";
const secureLogin = process.env.NODE_SECURE_LOGIN === "true";


/**
 * Authenticates a user by jwt
 * @param {String} token jwt token sent by client
 * @returns the boat of the authenticated user or throws error
 */
async function authenticate(token) {
    const auth = Authenticator.verifyToken(token);
    if (secureLogin) {
        const user = await User.getUserIdById(auth.userId);
        Authenticator.matchUUID(user.getUUID(), auth.uuid);
    }
    if (debug) console.log("User " + auth.userId + " authenticated");
    return await Boat.getBoatByUserId(auth.userId);
}


router.use(function (req, res, next) {
    console.log(req.url, "boat@", Date.now());
    next();
});

router
    .route("/")
    .put(async (req, res) => {              // UPDATE
        try {
            const boat = await authenticate(req.header('Authorization'));
            await boat.update(Validator.validateBoat(req.body));
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when adding/updating boat: " + message);
            return res.status(code).send(message);
        }
    })
    .get(async (req, res) => {              // GET
        try {
            const boat = await authenticate(req.header('Authorization'));
            return res.status(200).json(boat.toBoatInfoJson());
        } catch (error) {
            const { code, message } = Validator.handleError(error);
            console.log("Error when getting boat: " + message);
            return res.status(code).send(message);
        }
    });

module.exports = router;
