import { Command } from "../../Command";
import { MessageEmbed } from "discord.js";
import Schema from "../../../models/guild";
import TagSchema from "../../../models/tags";

export default class Settings extends Command {
    constructor(client) {
        super(client, {
            name: "settings",
            description: "The settings of the guild",
            slash: {
                name: "settings",
                description: "The settings of the guild"
            }
        });
    };

    async run(message, args) {

        const data = await Schema.findOne({ Guild: message.guild.id })
        if (!data) {
            const embed = new MessageEmbed()
                .setTitle("Settings")
                .setThumbnail(this.client.user.displayAvatarURL())
                .setDescription(String(`**Mass Mention Rate:** 10\n**Mass Caps Rate** 10`))
                //@ts-ignore
                .setColor(this.client.color.pink)
                .addFields(
                    {
                        name: "ModLogs Channel",
                        value: "`❌`",
                        inline: true
                    },
                    {
                        name: "Logs Channel",
                        value: "`❌`",
                        inline: true
                    },
                    {
                        name: 'Automod Links',
                        value: "`❌`",
                        inline: true
                    },
                    {
                        name: 'Automod Ads',
                        value: "`❌`",
                        inline: true
                    },
                    {
                        name: 'Automod nword',
                        value: "`❌`",
                        inline: true
                    },
                    {
                        name: 'Automod IP Loggers',
                        value: "`❌`",
                        inline: true
                    },
                    {
                        name: "Automod IPv4",
                        value: "`❌`",
                        inline: true
                    },
                    {
                        name: "Automod IPv6",
                        value: "`❌`",
                        inline: true
                    },
                );
            return message.channel.send({
                embeds: [embed]
            })
        }
        if (data) {
            const embed = new MessageEmbed()
                .setTitle("Settings")
                .setThumbnail(this.client.user.displayAvatarURL())
                //@ts-ignore
                .setColor(this.client.color.pink)
                .setDescription(String(`**Mass Mention Rate:** ${data.Massmentionrate}\n**Mass Caps Rate** ${data.Masscapsrate}`))
                .addFields(
                    {
                        name: "ModLogs Channel",
                        value: (data) ? (data.ModChannel) ? `<#${data.ModChannel}>`: "`❌`" : "`❌`",
                        inline: true
                    },
                    {
                        name: "Logs Channel",
                        value: (data) ? (data.LogChannel) ? `<#${data.LogChannel}>` : "`❌`" : "`❌`",
                        inline: true
                    },
                    {
                        name: 'Automod Links',
                        value: (data) ? (data.Automodlinks) ? "`✅`" : "`❌`" : "`❌`",
                        inline: true
                    },
                    {
                        name: 'Automod Ads',
                        value: (data) ? (data.Automodads) ? "`✅`" : "`❌`" : "`❌`",
                        inline: true
                    },
                    {
                        name: 'Automod nword',
                        value: (data) ? (data.Automodnword) ? "`✅`" : "`❌`" : "`❌`",
                        inline: true
                    },
                    {
                        name: 'Automod IP Loggers',
                        value: (data) ? (data.Automodiploggers) ? "`✅`" : "`❌`" : "`❌`",
                        inline: true
                    },
                    {
                        name: "Automod Mass Mention",
                        value: String((data) ? (data.Automodmassmention) ? "`✅`" : "`❌`" : "`❌`" + `\n **Mass Mention Rate:** ` + (data) ? `${data.Massmentionrate}` : 0),
                        inline: true
                    },
                    {
                        name: "Automod Mass Caps",
                        value: String((data ) ? (data.Automodmasscaps) ? "`✅`" : "`❌`" : "`❌`" + `**Mass Caps Rate:** ` + (data) ? `${data.Masscapsrate}` : 0),
                        inline: true
                    },
                    {
                        name: "Automod IPv4",
                        value: (data) ? (data.Automodipv4) ? "`✅`" : "`❌`" : "`❌`",
                        inline: true
                    },
                    {
                        name: "Automod IPv6",
                        value: (data) ? (data.Automodipv6) ? "`✅`" : "`❌`" : "`❌`",
                        inline: true
                    },
                );
                return message.channel.send({
                    embeds: [embed]
                })
        };
    }
};

