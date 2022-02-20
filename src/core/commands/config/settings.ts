import { Command } from "../../Command";
import { MessageEmbed, Message } from "discord.js";
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

    async run(message: Message) {

        const data = await Schema.findOne({ Guild: message.guild.id })
        if (!data) {
            const embed = new MessageEmbed()
                .setTitle("Settings")
                .setThumbnail(this.client.user.displayAvatarURL())
                .setDescription(String(`**Mass Mention Rate:** \`10\`\n**Mass Caps Rate:** \`10\`\n**Alt Account Type:** \`kick\`\n**Alt Account Days:** \`10\``))
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
                        name: "Alt Channel",
                        value: "`❌`",
                        inline: true
                    },
                    {
                        name: "Alt Detector",
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
                        name: "Automod Mass Mention",
                        value: "`❌`",
                        inline: true
                    },
                    {
                        name: "Automod Mass Caps",
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
                .setDescription(String(`**Mass Mention Rate:** \`${data.Massmentionrate}\`\n**Mass Caps Rate:** \`${data.Masscapsrate}\`\n**Alt Account Type:** \`${data.Alttype}\`\n**Alt Account Days:** \`${data.Altaccountdays}\``))
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
                        name: "Alt Channel",
                        value: (data) ? (data.AltsChannel) ? `<#${data.AltsChannel}>` : "`❌`" : "`❌`",
                        inline: true
                    },
                    {
                        name: "Alt Detector",
                        value: (data) ? (data.Automodalts) ? "`✅`" : "`❌`" : "`❌`",
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
                        value: String((data) ? (data.Automodmassmention) ? "`✅`" : "`❌`" : "`❌`"),
                        inline: true
                    },
                    {
                        name: "Automod Mass Caps",
                        value: String((data ) ? (data.Automodmasscaps) ? "`✅`" : "`❌`" : "`❌`"),
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

