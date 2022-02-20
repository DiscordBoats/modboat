import {Event} from "../../Event";
import {GuildMember, Message, MessageEmbed, TextChannel} from "discord.js";
import Schema from "../../../models/guild";

export default class GuildMemberAdd extends Event {
    constructor(client) {
        super(client, {
            name: "guildMemberAdd",
            once: false
        });
    };
    async run(member: GuildMember) {
        const unix = Math.floor(new Date(`${member.user.createdAt}`).getTime() / 1000);
        const data = await Schema.findOne({ Guild: member.guild.id });
        if (!data || !data.LogChannel) {
            return;
        }; 

        if (!member.guild.me.permissions.has('SEND_MESSAGES')) {
            return;
        };

        if (!member.guild.me.permissions.has("EMBED_LINKS")) {
            return;
        };

        const channel = member.guild.channels.cache.get(data.LogChannel) as TextChannel;
        if (!channel) {
            return;
        };
        if (channel) {
            channel.send({
                embeds: [
                    new MessageEmbed()
                    //@ts-ignore
                    .setColor(this.client.color.green)
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true}))
                    .setAuthor({
                        name: "📥 User Joined"
                    })
                    .setDescription(`<@${member.user.id}> | ${member.user.tag} (${member.user.id})\n\n**User Created:**\n<t:${unix}:f> (<t:${unix}:R>)`)
                ]
            })
        }
    }
}