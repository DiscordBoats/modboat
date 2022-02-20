import { Interaction, Message, MessageEmbed, version as DVer } from "discord.js";
import { Command } from "../../Command";

import moment from "moment";
require("moment-duration-format");

export default class stats extends Command {
    constructor(client) {
        super(client, {
            name: "stats",
            description: "The stats of Modboat",
            slash: {
                name: "stats",
                description: "The stats of Modboat"
            }
        });
    };

    async run(message: Message, args: string[]) {

        const uptime = moment.duration(this.client.uptime) as any;

        return message.channel.send({
            embeds: [
                {
                    author: {
                        name: message.author.tag,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    },
                    title: "Modboat Stats",
                    thumbnail: {
                        url: this.client.user.displayAvatarURL()
                    },
                    //@ts-ignore
                    color: this.client.color.pink,
                    fields: [
                        {
                            name: "Guilds",
                            value: `${this.client.guilds.cache.size}`,
                            inline: true
                        },
                        {
                            name: "Users",
                            value: `${this.client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0)}`,
                            inline: true
                        },
                        {
                            name: "Created At",
                            value: moment(this.client.user.createdAt).format("MM/DD/YYYY"),
                            inline: true
                        },
                        {
                            name: "Platform",
                            value: `${process.platform}`,
                            inline: true
                        },
                        {
                            name: "Node.js",
                            value: `${process.version}`,
                            inline: true
                        },
                        {
                            name: "Discord.js",
                            value: `${DVer}`,
                            inline: true
                        },
                        {
                            name: "Uptime",
                            value: `${uptime.format("D [days], H [hrs], m [mins], s [secs]")}`,
                            inline: true
                        },
                        {
                            name: "TypeScript",
                            value: require('typescript').version,
                            inline: true
                        },
                        {
                            name: "Commands",
                            value: `${this.client.commands.size}`,
                            inline: true
                        },
                        {
                            name: "Developers",
                            value: "https://github.com/DiscordBoats/modboat/graphs/contributors",
                            inline: true
                        }
                    ],
                }
            ]
        }).catch(err => {
            return;
        });
    };
};