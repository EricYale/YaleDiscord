require("dotenv").config();
const WebServer = require("./helpers/web-server");
const DiscordBot = require("./helpers/discord");
const DataManager = require("./helpers/dataManager");

const webServer = new WebServer();
const dataManager = new DataManager();
const discordBot = new DiscordBot(dataManager);
