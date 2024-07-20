const CasRoute = require("./cas");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const PORT = 80;

class WebServer {
    constructor() {
        this.cas = new CasRoute();
        this.initializeExpress();
        this.initializePassport();
        this.initializeCas();
        this.initializeWebServer();
        this.serve();
    }

    initializeExpress = () => {
        this.app = express();
        this.app.set("trust proxy", 1);
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    initializePassport = () => {
        this.app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true },
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }

    initializeCas = () => {
        const apiRouter = express.Router();
        apiRouter.get("/cas", this.cas.casLogin);
        this.app.use("/api", apiRouter);
    }

    initializeWebServer = () => {
        this.app.use(express.static("build"));
        this.app.all("*", (req, res) => { // Redirect other routes to single page web app
            res.sendFile(path.resolve("build", "index.html"));
        });
    }

    serve = () => {
        this.app.listen(PORT, () => {
            console.log(`App running on port ${PORT}`);
        });
    }
}

module.exports = WebServer;