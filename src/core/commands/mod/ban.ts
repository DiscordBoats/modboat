import { Message, User } from "discord.js";
import { Command } from "../../Command";

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

        if (!this.service.permission.checkMember(message, "BAN_MEMBERS", true)) {
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
                color: '#dc3b3b'
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