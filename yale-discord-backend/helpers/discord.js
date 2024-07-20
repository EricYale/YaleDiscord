const { Client, Events, GatewayIntentBits } = require("discord.js");

class DiscordBot {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent
            ],
        });
        this.setupCallbacks();
        this.client.login(process.env.DISCORD_TOKEN);
    }

    setupCallbacks = () => {
        this.client.once(Events.ClientReady, this.onClientReady);
        this.client.once(Events.GuildMemberAdd, this.onGuildMemberAdd);
        this.client.once(Events.MessageCreate, this.onMessageCreate);
    }

    onClientReady = (readyClient) => {
        console.log(`Discord bot running as ${readyClient.user}`);
    }

    onGuildMemberAdd = async (member) => {
        const linkToken = await this.dataManager.createLinkToken(member.id);
        member.send(`### Welcome to AKW Online! 💻😊\nTo start chatting, link your NetID by following this link:\n${process.env.WEB_URL}/link/${linkToken}`);
    }

    onMessageCreate = async (message) => {
        if(message.author.bot) return;
        if(message.content === "!link") {
            await this.onGuildMemberAdd(message.member);
        }
    }
}

module.exports = DiscordBot;
