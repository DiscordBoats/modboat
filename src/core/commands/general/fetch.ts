import {Message, MessageEmbed} from "discord.js";
import { Command } from "../../Command";
import moment from "moment";
import fetch from 'cross-fetch';

export default class Fetch extends Command {
    constructor(client) {
        super(client, {
            name: "fetch",
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
        switch(args[0]) {
            case "user":
                if(isNaN(Number(args[1]))) return message.channel.send({content: "Please send a valid user ID."})
                const globalUser = this.client.users.fetch(args[1])
                if(!globalUser) return message.channel.send({content: "Please send a valid user ID."})

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

                const reg = new RegExp(`${process.env.flaggedSpammer}`, "gmi")
                let spammer = reg.test(String((await globalUser).flags.bitfield))
                if(spammer) flags = "FLAGGED_SPAMMER"


                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setAuthor({name: (await globalUser).tag, iconURL: (await globalUser).avatarURL({dynamic:true})})
                            .setThumbnail((await globalUser).avatarURL({dynamic: true}))
                            .setDescription(`Bot: \`${(await globalUser).bot}\`\nID: \`${(await globalUser).id}\`\nCreated: \`${moment.utc((await globalUser).createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}\`\nFlags: \`${flags}\`\nBanner: [Click here](${banner})`)
                    ]
                })
            break;

          /*  case "spammer":
                if (!await this.service.permission.checkForManagerRole(message, "MANAGE_GUILD", true)) {
                    return;
                };

                const filter = (map, pred) => {
                    const result = new Map();
                    for (let [k, v] of map) {
                        if (pred(k, v)) {
                            result.set(k, v);
                        }
                    }
                    return result;
                }

                const members = await message.guild.members.fetch();
                let list = '';

                members.forEach((member, index) => {
                    try {
                        const reg = new RegExp(`${process.env.flaggedSpammer}`, "gmi")
                        let spammer = reg.test(String(member.user.flags.bitfield))
                        if(spammer) {
                            list += `${member.user.username}#${member.user.discriminator} (${member.user.id}) \`Bot: ${member.user.bot}\`\n`;
                            member.send({content: `You have been banned from \`${message.guild.name}\` due to you being flagged as a spammer from Discord.\n\nIf you believe this is a mistake, please contact \`Scar13t#1303\``})

                            message.guild.members.ban(member.user.id, {reason: "Flagged by Discord for spam."})

                             this.service.logger.modlogs({
                                client: this.client,
                                message: message,
                                moderator: message.member,
                                reason: "Flagged by Discord for spam." || null,
                                //@ts-ignore
                                user: String(member.user.tag),
                                userid: String(member.user.id),
                                title: 'Ban',
                                color: '#dc3b3b',
                                warn: true,
                                timeout: false
                            })
                        }
                    }catch (e) {
                        return;
                    }
                });

                if (list === '') {
                    return message.channel.send('No users found.');
                }

                const embed = new MessageEmbed()
                    //@ts-ignore
                    .setColor(this.client.color.blue)
                    .setTitle(`users found:`)
                    .setDescription(list.substring(0, 4096))
                    .setFooter({text: "Users have been banned."})
                await message.channel.send({
                    embeds: [embed]
                });
                break */
            default:
                return message.reply({content: "Valid arguments for fetch: `user [user ID]`, `spammer`"})

        }
    };
};