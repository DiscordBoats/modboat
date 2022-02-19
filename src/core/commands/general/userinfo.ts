import { CommandInteraction, GuildMember, Message } from "discord.js";
import { Command } from "../../Command";

import moment from "moment";

export default class userinfo extends Command {
    constructor(client) {
        super(client, {
            name: "userinfo",
            description: "Check your or a userinfo",
            slash: {
                name: "userinfo",
                description: "Check your or a userinfo",
                options: [
                    {
                        type: "USER",
                        name: "member",
                        description: "The member to get the info"
                    }
                ]
            }
        });
    };

    async run(message: Message, args: string[]) {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        return message.channel.send({
            embeds: [
                {
                    title: `${member.user.username}`,
                    //@ts-ignore
                    color: this.client.color.pink,
                    fields: [
                        {
                            name: "Nickname",
                            value: `${member.nickname || "None"}`,
                            inline: true
                        },
                        {
                            name: "Discrim",
                            value: `${member.user.tag}`,
                            inline: true
                        },
                        {
                            name: "ID",
                            value: `${member.user.id}`
                        },
                        {
                            name: `${message.guild.name}`,
                            value: moment(message.guild.createdAt).format("MM/DD/YYYY"),
                            inline: true
                        },
                        {
                            name: "Created At",
                            value: moment(member.user.createdAt).format("MM/DD/YYYY"),
                            inline: true
                        }
                    ],
                    author: {
                        name: message.author.tag,
                        icon_url: message.author.displayAvatarURL({ dynamic: true })
                    },
                    thumbnail: {
                        url: member.user.displayAvatarURL({ dynamic: true })
                    }
                }
            ]
        }).catch(err => {
            return;
        });
    };
};