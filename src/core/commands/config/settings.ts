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

    async run(message: Message, args: string[]) {

        if (!await this.service.permission.checkForManagerRole(message, 'MANAGE_GUILD', true)) {
            return;
        };

        switch ((args[0]) ? args[0].toLowerCase() : args[0]) {
            default: {
                const data = await Schema.findOne({ Guild: message.guild.id });
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
                                name: "Auto Role",
                                value: "`❌`",
                                inline: true
                            },
                            {
                                name: "Moderator Role",
                                value: "`❌`",
                                inline: true
                            },
                            {
                                name: "Manager Role",
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
                                name: 'Automod Scams',
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
                        .setFooter({
                            text: 'This is a preview of the settings, please use +settings view to see the full settings.'
                        })
                        .addFields(
                            {
                                name: "ModLogs Channel",
                                value: (data) ? (data.ModChannel) ? `<#${data.ModChannel}>` : "`❌`" : "`❌`",
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
                                name: "Auto Role",
                                value: (data) ? (data.Autorole) ? "`✅`" : "`❌`" : "`❌`",
                                inline: true
                            },
                            {
                                name: "Moderator Role",
                                value: (data) ? (data.Moderatorrole) ? "`✅`" : "`❌`" : "`❌`",
                                inline: true
                            },
                            {
                                name: "Manager Role",
                                value: (data) ? (data.Managerrole) ? "`✅`" : "`❌`" : "`❌`",
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
                                name: "Automod Scams",
                                value: (data) ? (data.Automodscams) ? "`✅`" : "`❌`" : "`❌`",
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
                                value: String((data) ? (data.Automodmasscaps) ? "`✅`" : "`❌`" : "`❌`"),
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
            };
                break;
            case 'view': {
                switch (args[1]) {
                    default: {
                        return message.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setURL('https://docs.antibot.xyz/anti-bot/settings')
                                    .setTitle("Settings")
                                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                    //@ts-ignore
                                    .setColor(this.client.color.red)
                                    .setDescription(`Arguments: \`tags\` | \`types\` | \`rates\` | \`channels\` | \`roles\` | \`automod\` | \`dm\` | \`text\``)
                            ]
                        })
                    }
                    break;
                    case 'tags': {
                        const data = await TagSchema.find({ Guild: message.guildId });

                        return message.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle("Custom Tags")
                                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                    //@ts-ignore
                                    .setColor(this.client.color.red)
                                    .setDescription(data.map((name) =>
                                        `\`${name.Command}\``).join(' |') || "No tags found")
                            ]
                        }).catch(() => {
                            return;
                        });
                    };
                    case 'types': {
                        const data = await Schema.findOne({ Guild: message.guild.id });
                        return message.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle('Types')
                                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                    //@ts-ignore
                                    .setColor(this.client.color.red)
                                    .setDescription(`**● Alt Account Type:** \`${data.Alttype}\``)
                            ]
                        });
                    };
                        break;
                    case 'rates': {
                        const data = await Schema.findOne({ Guild: message.guild.id });
                        return message.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle('Rates')
                                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                    //@ts-ignore
                                    .setColor(this.client.color.red)
                                    .setDescription(`**● Mass Mention Rate:** \`${data.Massmentionrate}\`\n**● Mass Caps Rate:** \`${data.Masscapsrate}\`\n**● Alt Account Days:** \`${data.Altaccountdays}\``)
                            ]
                        });
                    };
                        break;
                    case 'channels': {
                        const data = await Schema.findOne({ Guild: message.guild.id });
                        return message.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle('Channels')
                                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                    //@ts-ignore
                                    .setColor(this.client.color.red)
                                    .setDescription(`**● ModLogs Channel:** ${(data) ? (data.ModChannel) ? `<#${data.ModChannel}>` : "`❌`" : "`❌`"}\n**● Logs Channel:** ${(data) ? (data.ModChannel) ? `<#${data.ModChannel}>` : "`❌`" : "`❌`"}\n**● Alt Channel:** ${(data) ? (data.AltsChannel) ? `<#${data.AltsChannel}>` : "`❌`" : "`❌`"}`)
                            ]
                        });
                    };
                        break;
                    case 'roles': {
                        const data = await Schema.findOne({ Guild: message.guild.id });
                        return message.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle('Roles')
                                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                    //@ts-ignore
                                    .setColor(this.client.color.red)
                                    .setDescription(`**● Auto Role:** ${(data) ? (data.Autorole) ? "`✅`" : "`❌`" : "`❌`"}\n**● Moderator Role:** ${(data) ? (data.Moderatorrole) ? "`✅`" : "`❌`" : "`❌`"}\n**● Manager Role:** ${(data) ? (data.Managerrole) ? "`✅`" : "`❌`" : "`❌`"}\n**Auto Roles** ${data.Autoroles.map((x, i) => `\`${i + 1}\`. <@&${x}> - ${x}`.toString()).join('\n') || 'No roles found.'})\n**Manager Roles** ${data.Managerroles.map((x, i) => `\`${i + 1}\`. <@&${x}> - ${x}`.toString()).join('\n') || 'No roles found.'})\n**Moderator Roles** ${data.Moderatorroles.map((x, i) => `\`${i + 1}\`. <@&${x}> - ${x}`.toString()).join('\n') || 'No roles found.'}`)
                            ]
                        });
                    };

                    case 'automod': {
                        const data = await Schema.findOne({ Guild: message.guild.id });
                        return message.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle('Automod')
                                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                    //@ts-ignore
                                    .setColor(this.client.color.red)
                                    .setDescription(`**● Automod Nword:** ${(data) ? (data.Automodnword) ? "`✅`" : "`❌`" : "`❌`"}\n**● Automod IP Loggers:** ${(data) ? (data.Automodiploggers) ? "`✅`" : "`❌`" : "`❌`"}\n**● Automod Mass Mention:** ${String((data) ? (data.Automodmassmention) ? "`✅`" : "`❌`" : "`❌`")}\n**● Automod Mass Caps:** ${String((data) ? (data.Automodmasscaps) ? "`✅`" : "`❌`" : "`❌`")}\n**● Automod IPv4:** ${(data) ? (data.Automodipv4) ? "`✅`" : "`❌`" : "`❌`"}\n**● Automod IPv6:** ${(data) ? (data.Automodipv6) ? "`✅`" : "`❌`" : "`❌`"}\n**● Automod Scam:** ${(data) ? (data.Automodscams) ? "`✅`" : "`❌`" : "`❌`"}\n**● Automod Alts:** ${(data) ? (data.Automodalts) ? "`✅`" : "`❌`" : "`❌`"}\n**● Automod Links:** ${(data) ? (data.Automodlinks) ? "`✅`" : "`❌`" : "`❌`"}\n**● Automod Ads:** ${(data) ? (data.Automodads) ? "`✅`" : "`❌`" : "`❌`"}`)
                            ]
                        });
                    };
                        break;
                    case 'dm': {
                        const data = await Schema.findOne({ Guild: message.guild.id });
                        return message.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle('DM')
                                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                    //@ts-ignore
                                    .setColor(this.client.color.red)
                                    .setDescription(`**● Kick DM:** ${(data) ? (data.KickDM) ? "`✅`" : "`❌`" : "`❌`"}\n**● Ban DM:** ${(data) ? (data.BanDM) ? "`✅`" : "`❌`" : "`❌`"}`)
                            ]
                        });
                    };
                        break;
                    case 'text': {
                        const data = await Schema.findOne({ Guild: message.guild.id });
                        return message.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle('Text')
                                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                    //@ts-ignore
                                    .setColor(this.client.color.red)
                                    .setDescription(`**● Kick Text:** ${data.KickDMText
                                        .replace('{user}', `<@!${message.author.id}>`)
                                        .replace('{user.name}', message.author.username)
                                        .replace('{server.name}', message.guild.name)
                                        .replace('{user.id}', message.author.id)
                                        .replace('{server.id}', message.guild.id)
                                        }\n**● Ban Text:** ${data.BanDMText
                                            .replace('{user}', `<@!${message.author.id}>`)
                                            .replace('{user.name}', message.author.username)
                                            .replace('{server.name}', message.guild.name)
                                            .replace('{user.id}', message.author.id)
                                            .replace('{server.id}', message.guild.id)
                                        }`)
                            ]
                        });
                    };
                        break;

                };
            };
        };
    };
};

