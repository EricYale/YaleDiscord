const { Client, Events, GatewayIntentBits, ChannelType, PermissionsBitField } = require("discord.js");

class DiscordBot {
    constructor(dataManager, coursetableManager) {
        this.dataManager = dataManager;
        this.coursetableManager = coursetableManager;
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
        this.client.on(Events.GuildMemberAdd, this.onGuildMemberAdd);
        this.client.on(Events.MessageCreate, this.onMessageCreate);
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

    onMemberLinked = async (discordId, yaliesData) => {
        const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID);
        if(!guild) throw new Error("No guild found");
        const member = await guild.members.fetch(discordId);
        if(!member) throw new Error("No member found");

        member.roles.add(process.env.DISCORD_LINKED_ROLE_ID);
        member.setNickname(`${yaliesData.first_name} ${yaliesData.last_name} '${yaliesData.year.toString().substring(2)}`);
    }

    createRoleAndChannelForCourseIfNotExist = async (courseCode) => {
        const discordCourseData = await this.dataManager.getCourseInfo(courseCode);
        if(discordCourseData && discordCourseData.discordChannelId && discordCourseData.discordRoleId) {
            return discordCourseData;
        }

        const courseInfo = await this.coursetableManager.getCourseInfoForCourse(courseCode);
        if(!courseInfo) throw new Error("No course found");

        const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID);
        if(!guild) throw new Error("No guild found");


        let category = await guild.channels.cache.find(c => c.name === process.env.CURRENT_SEASON && c.type === ChannelType.GuildCategory);
        if(!category) {
            category = await guild.channels.create({
                name: process.env.CURRENT_SEASON,
                type: ChannelType.GuildCategory
            });
        }

        const role = await guild.roles.create({
            name: `Student :: ${courseCode} :: ${process.env.CURRENT_SEASON}`
        });

        const channel = await guild.channels.create({
            name: `${courseCode}-${process.env.CURRENT_SEASON}`,
            type: ChannelType.GuildText,
            parent: category,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: role.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        });

        await channel.setTopic(`${courseCode} - ${courseInfo.course.title}`);

        await this.dataManager.updateCourseInfo(courseCode, channel.id, role.id);

        return {
            discordChannelId: channel.id,
            discordRoleId: role.id,
        };
    }

    removeUserFromAllCourses = async (discordId) => {
        const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID);
        if(!guild) throw new Error("No guild found");
        const member = await guild.members.fetch(discordId);
        if(!member) throw new Error("No member found");

        const classRoles = member.roles.cache.filter((role) => role.name.startsWith("Student ::"));
        for(let role of classRoles.values()) {
            await member.roles.remove(role);
        }
    }

    registerUserForCourse = async (discordId, courseCode) => {
        const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID);
        if(!guild) throw new Error("No guild found");
        const member = await guild.members.fetch(discordId);
        if(!member) throw new Error("No member found");

        const {discordRoleId} = await this.createRoleAndChannelForCourseIfNotExist(courseCode);
        const role = await guild.roles.fetch(discordRoleId);
        if(!role) throw new Error("No role found");
        member.roles.add(role);
    }
}

module.exports = DiscordBot;
