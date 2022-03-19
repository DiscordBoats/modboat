import {Message, MessageEmbed} from "discord.js";
import { Command } from "../../Command";
import Schema from "../../../models/guild";

export default class Kick extends Command {
    constructor(client) {
        super(client, {
            name: "kick",
            description: "Kick a user",
            slash: {
                name: "kick",
                description: "Kick a user",
                options: [
                    {
                        type: "USER",
                        name: "member",
                        description: "The member to kick",
                        required: true
                    },
                    {
                        type: "STRING",
                        name: "reason",
                        description: "The reason for the kick",
                        required: true
                    }
                ]
            }
        });
    };

    async run(message: Message, args: string[]) {

        if (!await this.service.permission.checkForModeratorRole(message, "KICK_MEMBERS", true)) {
            return;
        };

        if (!this.service.permission.checkBot(message, "KICK_MEMBERS", true)) {
            return;
        };

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!args[0]) {
            return message.reply({
                content: "I need to know the user"
            }).catch(() => {
                return;
            });
        };

        if (!member) {
            return message.reply({
                content: "This user might not be in the server"
            }).catch(() => {
                return;
            });
        };

        if (member.id === message.author.id) {
            return message.reply({
                content: "You can't ban your self!"
            });
        };

        if (!member.kickable) {
            return message.reply({
                content: "This user either has a higher permission then me or same permission as me meaning i am unable to ban them"
            }).catch(() => {
                return;
            });
        };

        let reason = args.slice(1).join(" ");
        const data = await Schema.findOne({ Guild: message.guild.id });
        if (data && data.KickDM === true) {
            await member.send({
                embeds: [
                    new MessageEmbed()
                        .setDescription(data.KickDMText
                            .replace('{user}', `<@!${message.author.id}>`)
                            .replace('{user.name}', message.author.username)
                            .replace('{server.name}', message.guild.name)
                            .replace('{user.id}', message.author.id)
                            .replace('{server.id}', message.guild.id)
                            .replace('{reason}', reason || 'No reason provided'))
                        //@ts-ignore
                        .setColor(this.client.color.red)
                        .setThumbnail(message.guild.iconURL())
                    // .setFooter({text: "To appeal for your ban, contact the moderator that banned you."})
                ]
            }).catch((err) => {});
        };
        return member.kick(reason).then(async () => {
            await this.service.logger.modlogs({
                client: this.client,
                message: message,
                moderator: message.member,
                reason: reason || null,
                //@ts-ignore
                user: String(member.user.tag),
                userid: String(member.user.id),
                title: 'Kick',
                color: '#ff7f50',
                warn: true,
                timeout: false
            })
            return message.reply({
                content: "User has been kicked."
            }).catch(() => {
                return;
            });
        }).catch(() => {
            return message.reply({
                content: "An error has happend. Please join and tell the support server about the error. The support server link can be found on the docs."
            }).catch(() => {
                return;
            });
        });
    };
};