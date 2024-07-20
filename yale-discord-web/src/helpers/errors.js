const ERRORS = {
    _generic: {
        title: "Error",
        body: "An unexpected error occurred. Please contact a moderator for help.",
    },
    invalid_token: {
        title: "Expired Link",
        body: "The link you've followed has expired, so we couldn't connect your Discord account with your NetID. Please contact a moderator for help.",
    },
    discord_error: {
        title: "Could Not Apply Changes in Discord",
        body: "Sorry, there was a problem applying changes to Discord. Please contact a moderator for help.",
    },
    not_found_on_yalies: {
        title: "Not In Student Directory",
        body: "Sorry, we couldn't verify your status as a Yale undergraduate student. Please contact a moderator for help.",
    },
    database_error: {
        title: "Error Saving Data",
        body: "Sorry, there was an error saving your data. Please contact a moderator for help.",
    },
};

export default ERRORS;
