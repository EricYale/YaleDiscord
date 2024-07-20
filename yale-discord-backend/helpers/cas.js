const passport = require("passport");
const passportCas = require("passport-cas");

class CasRoute {
    constructor() {
        this.initializePassport();
    }

    initializePassport() {
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

    casLogin(req, res, next) {
        console.log(1)
        const authFunction = passport.authenticate("cas", (err, user) => {
            console.log(2)
            if(err) return next(err);
            if(!user) return next(new Error("No user"));
            return req.logIn(user, (err) => {
                if(err) return next(err);
                // TODO: do something
                console.log(user);
                return res.redirect("/success");
            });
        });
        authFunction(req, res, next);
    }
}

module.exports = CasRoute;