import {Event} from "../../Event";
import {Message, MessageEmbed, TextChannel} from "discord.js";
import Schema from "../../../models/guild";

export default class MessageUpdate extends Event {
    constructor(client) {
        super(client, {
            name: "messageUpdate",
            once: false
        });
    };
    async run(message: Message, messageUpdate: MessageUpdate): Promise<Message>{
        const data = await Schema.findOne({ Guild: message.guild.id });
        if (!data || !data.LogChannel) {
            return;
        }; 

        if (!message.guild.me.permissions.has('SEND_MESSAGES')) {
            return;
        };

        if (!message.guild.me.permissions.has("EMBED_LINKS")) {
            return;
        };

        const channel = message.guild.channels.cache.get(data.LogChannel) as TextChannel;
        if (!channel) {
            return;
        };
        if (message.guild.me) {
            return;
        }
        if (channel) {
            channel.send({
                embeds: [
                    new MessageEmbed()
                    //@ts-ignore
                    .setColor(this.client.color.yellow)
                    .setDescription(`<@${message.author.id}> | ${message.author.tag} (${message.author.id})\na [message](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}) updated in <#${message.channel.id}>\n`)
                    .addField('Old Message:', `\`${message.content}\``)
                    .addField('New Message:', `\`${messageUpdate}\``)
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                ]
            })
        }
    }
}