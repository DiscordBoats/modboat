import { Message, MessageEmbed, User } from "discord.js";
import { Command } from "../../Command";
import Schema from "../../../models/guild";

export default class Ban extends Command {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "Ban a user",
            slash: {
                name: "ban",
                description: "Ban a user",
                options: [
                    {
                        type: "USER",
                        name: "member",
                        description: "The member to ban",
                        required: true
                    },
                    {
                        type: "STRING",
                        name: "reason",
                        description: "The reason for the ban",
                        required: true
                    }
                ]
            }
        });
    };

    async run(message: Message, args: string[]) {

        if (!await this.service.permission.checkForModeratorRole(message, "BAN_MEMBERS", true)) {
            return;
        };

        if (!this.service.permission.checkBot(message, "BAN_MEMBERS", true)) {
            return;
        };

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!args[0]) {
            return message.reply({
                content: "I need to know the user!"
            }).catch(() => {
                return;
            });
        };

        if (!member) {
            return message.reply({
                content: "This user might not be in the server!"
            }).catch(() => {
                return;
            });
        };

        if (member.permissions.has("BAN_MEMBERS")) {
            return message.reply({
                content: "User has been banned"
            }).then(msg => {
                setTimeout(() => {
                    msg.edit({ content: "https://images-ext-1.discordapp.net/external/dEr5HBngRZqBS_YGNYJBanGszjewYiKth1Iz-mOwNdw/%3Fc%3DVjFfZGlzY29yZA/https/media.tenor.com/yheo1GGu3FwAAAPo/rick-roll-rick-ashley.mp4" })

                }, 5000)
            })
        };

        if (member.id === message.author.id) {
            return message.reply({
                content: "You can't ban your self!"
            });
        };

        if (!member.bannable) {
            return message.reply({
                content: "This user either has a higher permission then me or same permission as me meaning i am unable to ban them!"
            }).catch(() => {
                return;
            });
        };

        let reason = args.slice(1).join(" ");
        const data = await Schema.findOne({ Guild: message.guild.id });
        if (data && data.BanDM === true) {
            await member.send({
                embeds: [
                    new MessageEmbed()
                        .setDescription(data.BanDMText
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
        return member.ban({
            reason
        }).then(async () => {
            await this.service.logger.modlogs({
                client: this.client,
                message: message,
                moderator: message.member,
                reason: reason || null,
                //@ts-ignore
                user: String(member.user.tag),
                userid: String(member.user.id),
                title: 'Ban',
                color: '#dc3b3b',
                warn: true,
                timeout: false
            })
            return message.reply({
                content: "User has been banned."
            }).catch(() => {
                return;
            });
        }).catch(() => {
            return message.reply({
                content: "An error occured."
            }).catch(() => {
                return;
            });
        });
    };
};