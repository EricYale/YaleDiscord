require("dotenv").config();
const WebServer = require("./helpers/web-server");
const DiscordBot = require("./helpers/discord");
const DataManager = require("./helpers/dataManager");
const YaliesManager = require("./helpers/yaliesManager");
const CoursetableManager = require("./helpers/coursetableManager");

const dataManager = new DataManager();
const yaliesManager = new YaliesManager();
const coursetableManager = new CoursetableManager();
const discordBot = new DiscordBot(dataManager);
const webServer = new WebServer(discordBot, dataManager, yaliesManager, coursetableManager);
