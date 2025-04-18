"use strict";
const express = require("express");

let port = process.env.NODE_HTTP_PORT || 7000;
const https_port = process.env.NODE_HTTPS_PORT || 7443;
const debug = process.env.DEBUG === "true";
const develop = process.env.DEVELOP === "true";
const use_https = process.env.NODE_HTTPS === "true"
const ssl_key_pass = process.env.SSL_KEY_PASS || "132457689"

const user = require("./routes/user");
const signal = require("./routes/signal");
const https = require("https");
const helmet = require("helmet");
var fs = require('fs');

let options = {};
const app = express();


app.use(express.json());

app.use("/user", user);
app.use("/signal", signal);

//handle root
app.get("/", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var data = fs.readFileSync('./src/index.html');
    res.write(data);
    res.end();
});


if (use_https) {
    app.use(helmet());
    port = https_port;
    options = {
        key: fs.readFileSync("./secret/signal-key.pem"),
        cert: fs.readFileSync("./secret/signal-cert.pem"),
        dhparam: fs.readFileSync("./secret/dh-strong.pem"),
        passphrase: ssl_key_pass
    };

    https.createServer(options, app).listen(port, err => {
        if (err) {
            return console.log("ERROR", err);
        }
        console.log(`Listening on port ${port}`);
        console.log("Debug: " + debug);
        console.log("Develop: " + develop);
    });
} else {
    app.listen(port, err => {
        if (err) {
            return console.log("ERROR", err);
        }
        console.log(`Listening on port ${port}`);
        console.log("Debug: " + debug);
        console.log("Develop: " + develop);
    });
}

//# https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker
// https://www.sitepoint.com/how-to-use-ssltls-with-node-js/
