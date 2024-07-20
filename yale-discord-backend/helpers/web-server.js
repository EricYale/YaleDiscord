const CasRoute = require("./cas");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const PORT = 80;

class WebServer {
    constructor(discordBot, dataManager, yaliesManager, coursetableManager) {
        this.discordBot = discordBot;
        this.dataManager = dataManager;
        this.yaliesManager = yaliesManager;
        this.coursetableManager = coursetableManager;
        this.cas = new CasRoute(discordBot, dataManager, yaliesManager);
        this.initializeExpress();
        this.initializePassport();
        this.initializeRouter();
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

    initializeRouter = () => {
        const apiRouter = express.Router();
        apiRouter.get("/cas", this.cas.casLogin);
        apiRouter.get("/courses", this.getCourseData);
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

    getCourseData = (req, res, next) => {
        const data = this.coursetableManager.getCourseData();
        if(!data) return next(new Error("Course data hasn't been fetched yet."));
        res.json(data);
    }
}

module.exports = WebServer;