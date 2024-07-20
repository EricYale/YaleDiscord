const passport = require("passport");
const passportCas = require("passport-cas");

class CasRoute {
    constructor(discordBot, dataManager, yaliesManager) {
        this.discordBot = discordBot;
        this.dataManager = dataManager;
        this.yaliesManager = yaliesManager;
        this.initializePassport();
    }

    initializePassport = () => {
        passport.use(
            new passportCas.Strategy({
                version: "CAS2.0",
                ssoBaseURL: "https://secure.its.yale.edu/cas",
            }, async (profile, done) => {
                return done(null, { netId: profile.user });
            })
        );
        passport.serializeUser((user, done) => {
            done(null, user);
        });
        passport.deserializeUser((user, done) => {
            done(null, user);
        });
    }

    casLogin = (req, res, next) => {
        const token = req.query.token;
        if(!token) return next(new Error("No token specified"));

        const authFunction = passport.authenticate("cas", (err, user) => {
            if(err) return next(err);
            if(!user) return next(new Error("No user"));
            return req.logIn(user, async (err) => {
                if(err) return next(err);
                return await this.onAuthSuccess(req, res, next, token, user);
            });
        });
        authFunction(req, res, next);
    }

    onAuthSuccess = async (req, res, next, token, user) => {
        console.log(`Logged in ${user.netId} as ${token}`);
        const discordId = await this.dataManager.getDiscordIdFromLinkToken(token);
        if(!discordId) return res.redirect("/error/invalid_token");

        const yaliesData = await this.yaliesManager.getUserByNetId(user.netId);
        if(!yaliesData) return res.redirect("/error/not_found_on_yalies");

        try {
            await this.dataManager.updateWithInitialData(discordId, yaliesData);
        } catch(e) {
            console.error(e);
            return res.redirect("/error/database_error");
        }

        try {
            await this.discordBot.onMemberLinked(discordId, yaliesData);
        } catch(e) {
            console.error(e);
            return res.redirect("/error/discord_error");
        }
        return res.redirect("/profile/" + token);
    }
}

module.exports = CasRoute;