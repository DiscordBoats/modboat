import { Event } from "../../../Event";
import { GuildMember, Message, MessageEmbed, TextChannel } from "discord.js";
import Schema from "../../../../models/guild";



export default class AltDetector extends Event {
    constructor(client) {
        super(client, {
            name: "guildMemberAdd",
            once: false,
        });
    };
    async run(member: GuildMember) {


   if (message.author.bot) return;
        const data = await Schema.findOne({ Guild: member.guild.id });
        if (!data || !data.AltsChannel) {
            return;
        };

        if (!member.guild.me.permissions.has('SEND_MESSAGES')) {
            return;
        };

        if (!member.guild.me.permissions.has("EMBED_LINKS")) {
            return;
        };
        if (data.Altaccountdays == 0) {
            return;
        };
        const channel = member.guild.channels.cache.get(data.AltsChannel) as TextChannel;
        const unix = Math.floor(new Date(`${member.user.createdAt}`).getTime() / 1000);
        if (!channel) {
            return;
        };
        if (data && data.Automodalts == false) {
            return;
        }
        let creation = Date.now() - Number(member.user.createdAt);
        let created = Math.floor(creation / 86400000)
        if (created < data.Altaccountdays) {
            if (data.Alttype == 'kick') {
                member.send({
                    content: `You have been kicked from **${member.guild.name}** for having a young account.`
                }).catch((e) => { }).then(async () => {
                    await member.kick(`Account was created less than ${data.Altaccountdays} days ago`).then(() => {
                        channel.send({
                            embeds: [
                                new MessageEmbed()
                                    //@ts-ignore
                                    .setColor(this.client.color.yellow)
                                    .setThumbnail(member.user.avatarURL({ dynamic: true, format: 'png' }))
                                    .setDescription(`🔰 <@${member.user.id}> | ${member.user.tag} (${member.user.id}) has been automatically **${data.Alttype}ed** - Their account is under ${data.Altaccountdays}.\n\n**User Created:**\n<t:${unix}:f> (<t:${unix}:R>)`)
                            ]
                        });
                    });
                });
                await member.kick(`Account was created less than ${data.Altaccountdays} days ago`).then(() => {
                    channel.send({
                        embeds: [
                            new MessageEmbed()
                            //@ts-ignore
                            .setColor(this.client.color.yellow)
                            .setThumbnail(member.user.avatarURL({ dynamic: true, format: 'png' }))
                            .setDescription(`🔰 <@${member.user.id}> | ${member.user.tag} (${member.user.id}) has been automatically **${data.Alttype}ed** - Their account is under ${data.Altaccountdays}.\n\n**User Created:**\n<t:${unix}:f> (<t:${unix}:R>)`)
                        ]
                    });
                });
            };

            if (data.Alttype == 'ban') {
                member.send({
                    content: `You have been banned from **${member.guild.name}** for having a young account.`
                }).catch((e) => { }).then(async () => {
                    await member.ban({
                        reason: `Account was created less than ${data.Altaccountdays} days ago`
                    }).then(() => {
                        channel.send({
                            embeds: [
                                new MessageEmbed()
                                    //@ts-ignore
                                    .setColor(this.client.color.yellow)
                                    .setThumbnail(member.user.avatarURL({ dynamic: true, format: 'png' }))
                                    .setDescription(`🔰 <@${member.user.id}> | ${member.user.tag} (${member.user.id}) has been automatically **${data.Alttype}ned** - Their account is under ${data.Altaccountdays}.\n\n**User Created:**\n<t:${unix}:f> (<t:${unix}:R>)`) 
                            ] 
                        });
                    });
                });
                await member.ban({
                    reason: `Account was created less than ${data.Altaccountdays} days ago`
                }).then(() => {
                    channel.send({
                        embeds: [
                            new MessageEmbed()
                                    //@ts-ignore
                                    .setColor(this.client.color.yellow)
                                    .setThumbnail(member.user.avatarURL({ dynamic: true, format: 'png' }))
                                    .setDescription(`🔰 <@${member.user.id}> | ${member.user.tag} (${member.user.id}) has been automatically **${data.Alttype}ned** - Their account is under ${data.Altaccountdays}.\n\n**User Created:**\n<t:${unix}:f> (<t:${unix}:R>)`) 
                        ]
                    })
                })
            };
        };
    };
}
