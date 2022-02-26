import { Message, MessageEmbed } from "discord.js"; 
import { Command } from "../../Command";
import Schema from "../../../models/warn";

export default class Warns extends Command {
    constructor(client) {
        super(client, {
            name: "warnings",
            description: "Views the warnings of the user"
        });
    };

    async run(message: Message, args: string[]) {
        if (!this.service.permission.checkMember(message, "MODERATE_MEMBERS", true)) {
            return;
        };
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            return message.reply({
                content: 'You need to mention the user'
            });
        };

        const data = await Schema.find({ User: member.id, Guild: message.guild.id });
        return message.reply({
            embeds: [
                new MessageEmbed()
                .setTitle(`${member.user.username}\'s Infractions`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                //@ts-ignore
                .setColor(this.client.color.pink)
                .setDescription(`If this user has over **5** warnings, you should ban them.\n${data.map((d, v) =>`**${v + 1}.** [\`${d.WarnNum} - ${d.Reason}\`](https://discord.com/channels/${d.Guild}/${d.ChannelId}/${d.MessageId})`).join('\n')}`)
            ]
        })
    }
}
