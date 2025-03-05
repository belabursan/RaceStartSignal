"use strict";
const express = require("express");
const User = require("../src/User.js");
const Validator = require("../src/Validator.js");
const ErrorHandler = require("../src/ErrorHandler.js");
const Authenticator = require("../src/Auth.js");
const Mail = require("../src/Mail.js");

const debug = process.env.DEBUG === "true";
let router = express.Router();


/**
 * Authenticates a user by jwt
 * @param {String} token jwt token from the user
 * @returns the user or throws error
 */
async function authenticate(token) {
    const auth = Authenticator.verifyToken(token);
    try {
        const user = await User.getUserIdById(auth.userId);
        if (debug) console.log("User " + auth.userId + " authenticated");
        return user;
    } catch (error) {
        throw new Error("Unauthorized. (" + error.message + ")");
    }
}


router.use(function (req, res, next) {
    console.log(req.url, "user@", Date.now());
    next();
});


router
    .route("/")
    .get(async (req, res) => {        // GET A USER
        try {
            const user = await authenticate(req.header('Authorization'));
            return res.status(200).json(user.toUserInfoJson());
        } catch (error) {
            const { code, message } = ErrorHandler.handleError(error);
            console.log("Error when getting user: " + message);
            return res.status(code).send(message);
        }
    })
    .put(async (req, res) => {        // UPDATE A USER
        try {
            const user = await authenticate(req.header('Authorization'));
            await user.update(Validator.validateUser(req.body, false));
            return res.sendStatus(200);
        }
        catch (error) {
            const { code, message } = ErrorHandler.handleError(error);
            console.log("ERROR when updating user (" + req.body.email + "): " + message);
            return res.status(code).send(message);
        }
    })
    .post(async (req, res) => {   // REGISTER A NEW USER
        try {
            const user = new User(Validator.validateUser(req.body));
            const result = await user.addUserToDb();

            try {
                await Mail.sendEmailToUser(user.getEmail(), result.password);
            } catch (err) {
                console.log(err.message);
                console.log("Rolling back user insertion");
                await user.deleteUser();
                return res.status(500).send("Mail service down");
            }
            const id = result.id.toString();
            console.log("User(" + req.body.email + ") registered as: " + id);
            return res.status(201).set('Content-Type', 'text/html').send(id);
        }
        catch (error) {
            const { code, message } = ErrorHandler.handleError(error);
            console.log("ERROR when adding user (" + req.body.email + "): " + message);
            return res.status(code).send(message);
        }
    })
    .delete(async (req, res) => {         // DELETE USER
        try {
            const user = await authenticate(req.header('Authorization'));
            user.deleteUser();
            return res.sendStatus(200);
        } catch (error) {
            const { code, message } = ErrorHandler.handleError(error);
            return res.status(code).send(message);
        }
    });


router
    .route("/login")
    .post(async (req, res) => {     // LOGIN AS USER
        try {
            const { email, password } = Validator.isValidLoginInfo(req.body);
            const user = await User.getUserIdByEmail(email);
            await Authenticator.matchPassword(password, user.getPassHash());
            const user_id = user.getId();
            const token = Authenticator.sign(user_id);

            console.log("User " + email + " has logged in");
            return res.status(200).send(token.toString());
        }
        catch (error) {
            console.log(error.message);
            return res.status(409).send(error.message);
        }
    });

router
    .route("/reset")
    .post(async (req, res) => {     // RESET USER
        try {
            const email = req.query.email;
            const pass = await User.resetPassword(email);
            try {
                await Mail.sendEmailToUser(email, pass);
                return res.sendStatus(200);
            } catch (err) {
                console.log(err.message);
                console.log("Failed to send password " + pass + " to " + email);
                return res.status(500).send("Mail service down");
            }
        }
        catch (error) {
            console.log(error.message);
            return res.status(409).send(error.message);
        }
    });

module.exports = router;
