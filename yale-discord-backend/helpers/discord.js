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
        await this.createLinkToken(member);
    }
    
    createLinkToken = async (member) => {
        let linkToken;
        try {
            linkToken = await this.dataManager.createLinkToken(member.id);
        } catch(e) {
            console.error(e);
            return;
        }
        member.send(`### Welcome to AKW Online! 💻😊\nTo start chatting, link your NetID by following this link:\n${process.env.WEB_URL}/link/${linkToken}`);
        return linkToken;
    }

    onMessageCreate = async (message) => {
        if(message.author.bot) return;
        if(!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        if(message.content.startsWith("!link")) {
            if(message.mentions.members.size === 0) {
                await this.createLinkToken(message.member);
                return;
            }
            const sendTo = message.mentions.members.first();
            const token = await this.createLinkToken(sendTo);
            await message.member.send(`Link token created for ${sendTo.user.username}.\n${process.env.WEB_URL}/link/${token}`);
            await message.channel.send(`I've created a URL for ${sendTo.user.username}. It's been sent to their DMs.`);
            return;
        }
        
        if(message.content.startsWith("!cleanup")) {
            if(message.content.indexOf(" ") === -1) {
                await message.channel.send("Please provide a course code to clean up.");
                return;
            }

            const course = message.content.substring(message.content.indexOf(" ") + 1);
            let result;
            try {
                result = await this.deleteCourseChannelAndRole(course)
            } catch(e) {
                console.error(e);
                await message.channel.send(`Could not delete \`${course}\`. An error occurred.`);
                return;
            }
            if(result) {
                try {
                    await message.channel.send(`Course channel and role for \`${course}\` have been deleted. Database has been updated.`);
                } catch(e) {
                    // It's OK!
                    // The user probably sent the command in the course channel, which has just been deleted.
                    return;
                }
            } else {
                await message.channel.send(`Could not delete \`${course}\`. Are you sure that course code exists?`);
            }
            return;
        }
    }

    onMemberLinked = async (discordId, yaliesData) => {
        const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID);
        if(!guild) {
            console.error("No guild found.");
            return;
        }
        const member = await guild.members.fetch(discordId);
        if(!member) {
            console.error("No member found.");
            return;
        }

        await member.roles.add(process.env.DISCORD_LINKED_ROLE_ID);
        await member.setNickname(`${yaliesData.first_name} ${yaliesData.last_name} '${yaliesData.year.toString().substring(2)}`);
    }

    createRoleAndChannelForCourseIfNotExist = async (courseCode) => {
        let discordCourseData;
        try {
            discordCourseData = await this.dataManager.getCourseInfo(courseCode);
        } catch(e) {
            console.error(e);
            throw new Error("Failed to get course info");
        }
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

        try {
            await this.dataManager.updateCourseInfo(courseCode, channel.id, role.id);
        } catch(e) {
            console.error(e);
            throw new Error("Failed to update course info");
        }

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

        const classRoles = member.roles.cache.filter(
            (role) =>
                role.name.startsWith("Student ::") &&
                role.name.endsWith(`:: ${process.env.CURRENT_SEASON}`)
            );

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

    deleteCourseChannelAndRole = async (courseCode) => {
        const discordCourseData = await this.dataManager.getCourseInfo(courseCode);
        if(!discordCourseData) return false;

        const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID);
        if(!guild) throw new Error("No guild found");

        const channel = await guild.channels.fetch(discordCourseData.discordChannelId);
        if(channel) await channel.delete();

        const role = await guild.roles.fetch(discordCourseData.discordRoleId);
        if(role) await role.delete();

        try {
            await this.dataManager.deleteCourseInfo(courseCode);
        } catch(e) {
            console.error(e);
            throw new Error("Failed to delete course info");
        }

        return true;
    }
}

module.exports = DiscordBot;
