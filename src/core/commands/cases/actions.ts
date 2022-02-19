import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../Command";
import Schema from '../../../models/cases';

export default class Actions extends Command {
    constructor(client) {
        super(client, {
            name: "actions",
            description: "Pulls up actions of a user"
        });
    };

    async run (message: Message, args: string[]) {

        if (!this.service.permission.checkMember(message, "KICK_MEMBERS", true)) {
            return;
        };

        if (!this.service.permission.checkBot(message, "KICK_MEMBERS", true)) {
            return;
        };

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            return message.reply({
                content: "I need to know the user"
            }).catch(() => {
                return;
            });
        };

        const data = await Schema.find({ Guild: message.guild.id, User: member.user.id });

        return message.reply({
            embeds: [
                new MessageEmbed()
                .setTitle(`${member.user.username}'s infractions`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                //@ts-ignore
                .setColor(this.client.color.pink)
                .setDescription(data.map((d, i) =>`\`\`Case: ${d.Case} Reason: ${d.Reason}\`\``).join('\n'))
            ]
        }).catch(() => {
            return;
        });
    }
}