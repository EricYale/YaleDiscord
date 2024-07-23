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
        apiRouter.post("/updateSeason", this.updateSeasonForUser);
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

    updateSeasonForUser = async (req, res, next) => {
        const token = req.body.token;
        if(!token) return res.status(400).send("invalid_data");
        const discordId = await this.dataManager.getDiscordIdFromLinkToken(token);
        if(!discordId) return res.status(400).send("invalid_token");

        const courseCodes = req.body.courses;
        if(!courseCodes || !Array.isArray(courseCodes)) return res.status(400).send("invalid_data");
        if(courseCodes.length > 5) return res.status(400).send("invalid_data");

        try {
            await this.dataManager.updateSeasonForUser(discordId, courseCodes);
        } catch(e) {
            return res.status(400).send("database_error");
        }

        try {
            await this.discordBot.removeUserFromAllCourses(discordId);
            for(const courseCode of courseCodes) {
                await this.discordBot.registerUserForCourse(discordId, courseCode);
            }
        } catch(e) {
            return res.status(400).send("discord_error");
        }

        res.status(200).end();
    }
}

module.exports = WebServer;