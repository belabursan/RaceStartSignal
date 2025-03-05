"use strict";
const express = require("express");


const debug = process.env.DEBUG === "true";
const develop = process.env.DEVELOP === "true";
let port = process.env.NODE_HTTP_PORT || 7000;
const https_port = process.env.NODE_HTTPS_PORT || 7443;
const use_https = process.env.NODE_HTTPS === "true"
const ssl_key_pass = process.env.SSL_KEY_PASS || "123456"

const user = require("./routes/user");
const admin = require("./routes/admin");
const boat = require("./routes/boat");
const race = require("./routes/race");
const sysadmin = require("./routes/sysadmin");
const season = require("./routes/season.js");
const https = require("https");
const helmet = require("helmet");
var fs = require('fs');

let options = {};
const app = express();


app.use(express.json());

app.use("/user", user);
app.use("/admin", admin);
app.use("/boat", boat);
app.use("/race", race);
app.use("/sysadmin", sysadmin);
app.use("/season", season);

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
        key: fs.readFileSync("./secret/sailrace-key.pem"),
        cert: fs.readFileSync("./secret/sailrace-cert.pem"),
        dhparam: fs.readFileSync("./secret/dh-strong.pem"),
        passphrase: ssl_key_pass
        //openssl dhparam -out /var/www/example/sslcert/dh-strong.pem 2048
        /*
        Generating a self-signed certificate for Node.js can be done using OpenSSL.
        First, you need to install OpenSSL on your system. Once installed, you can
        generate a self-signed certificate using the following command:

            openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

        This will create a new RSA key pair, and a certificate that is valid for 365 days.
        The -keyout option specifies the filename to write the newly created private key to,
        and the -out option specifies the output filename of the certificate.
        */
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

/**
 * "/abc" - handles /abc
 * "/ab?cd" - handles /acd or /abcd
 * "/ab+cd" - handles /abcd, /abbbcd, /abbbbbbbcd, etc
 * "/ab*cd" - "/ab" + anything + "cd"
 * /a/ - RegExp: anything that contains "a"
 * /.*man$/ - RegExp: anything that ends with "man"
 * ^ - starts with
 */

//# https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker
// https://www.sitepoint.com/how-to-use-ssltls-with-node-js/
