import { Message } from "discord.js"; 
import { Command } from "../../Command";
import Schema from "../../../models/warn";

export default class Warn extends Command {
    constructor(client) {
        super(client, {
            name: "warn",
            description: "Warns a user"
        });
    };

    async run(message: Message, args: string[]) {
        if (!this.service.permission.checkMember(message, "MODERATE_MEMBERS", true)) {
            return;
        };
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (member.id === message.author.id || member.id === this.client.user.id) {
            return message.reply({
                content: 'You cannot warn the bot or yourself.'
            });
        };

        if (!member) {
            return message.reply({
                content: 'You need to mention the user'
            });
        };

        if (!member.kickable) {
            return message.reply({
                content: 'You cannot warn this user'
            }).catch((e) => {return;});
        };
        let reason = args.slice(1).join(" ");
        this.client.database.update.addWarning({
            UserId: member.id,
            GuildId: message.guild.id,
            Reason: reason || 'No reason provided',
            MessageId: message.id,
            ChannelId: message.channel.id
        })
        message.reply({
            content: `${member.user.tag} (${member.user.id}) has been warned`
        }).then(async () => {
         //   await member.send(`You have been warned in **${message.guild.name}** for \`${reason || 'No reason provided'}\``).catch((e) => {return message.reply({ content: 'Could not dm this user'})})
        });
        this.service.logger.modlogs({
            client: this.client,
            message: message,
            moderator: message.member,
            reason: reason || null,
            //@ts-ignore
            user: String(member.user.tag),
            userid: String(member.user.id),
            title: 'Warn',
            color: '#E59866',
            timeout: false
        })
    }
}