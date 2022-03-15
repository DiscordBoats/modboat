import {CommandInteraction, GuildMember, Message, MessageEmbed} from "discord.js";
import { Command } from "../../Command";

import moment from "moment";
import {Permission} from "../../../services/Permission";

import fetch from 'cross-fetch';

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
        if(!isNaN(Number(args[0]))) return message.channel.send({content: "Please send a valid user ID."})
        const globalUser = this.client.users.fetch(args[0])
        if(!globalUser) return message.channel.send({content: "Please send a valid user ID."})
        const member = message.guild.members.cache.get(args[0])


        let userBanner = await fetch(`https://japi.rest/discord/v1/user/${(await globalUser).id}`).then(res => res.json())
        let banner = userBanner.data.bannerURL

        if(!banner) {
            banner = "https://media.discordapp.net/attachments/854794095066349618/919104448201117706/unknown.png"
        } else {
            banner = userBanner.data.bannerURL + '?size=2048'
        }
        let flags = userBanner.data.public_flags_array.join(' | ')
        if(flags.length > 100) {
            flags = "User has too many flags to display."
        }
        if(!flags) {
            flags = "User has no flags, or I can't find them."
        }



        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setAuthor({name: member.user.tag, iconURL: member.user.avatarURL({dynamic: true})})
                    .setThumbnail((await globalUser).avatarURL({dynamic: true}))
                    .setDescription(`Bot: \`${(await globalUser).bot}\`\n`)
            ]
        })
    };
};