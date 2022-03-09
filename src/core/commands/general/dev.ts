import {Interaction, Message, MessageEmbed} from "discord.js";
import { Command } from "../../Command";
import { exec } from "child_process";


export default class Dev extends Command {
    constructor(client) {
        super(client, {
            name: "dev",
            description: "mmm yes dev"
        });
    };

    async run(message: Message, args: string[]) {
        if (!process.env.developers.includes(message.author.id)) return message.channel.send({content: "https://media.discordapp.net/attachments/943222783708655670/949895380940763197/fd7.png"});

        switch(args[0]) {
            case "override":

                switch(args[1]) {
                    case "kick":
                        const member = message.mentions.members.first() || message.guild.members.cache.get(args[2]);

                        if(member.permissions.has("MANAGE_MESSAGES")) return message.channel.send("You can't kick this person!");

                        if (!args[2]) {
                            return message.reply({
                                content: "I need to know the user"
                            }).catch(() => {
                                return;
                            });
                        };

                        if (!member) {
                            return message.reply({
                                content: "This user might not be in the server"
                            }).catch(() => {
                                return;
                            });
                        };

                        if (member.id === message.author.id) {
                            return message.reply({
                                content: "You can't ban your self!"
                            });
                        };

                        if (!member.kickable) {
                            return message.reply({
                                content: "This user either has a higher permission then me or same permission as me meaning i am unable to ban them"
                            }).catch(() => {
                                return;
                            });
                        };

                        let reason = args.slice(3).join(" ") || "No reason given" || "No reason given";

                        return member.kick(reason).then(async () => {
                            await this.service.logger.modlogs({
                                client: this.client,
                                message: message,
                                moderator: message.member,
                                reason: reason || null,
                                //@ts-ignore
                                user: String(member.user.tag),
                                userid: String(member.user.id),
                                title: 'Kick',
                                color: '#ff7f50',
                                warn: true,
                                timeout: false
                            })
                            return message.reply({
                                content: "User has been kicked."
                            }).catch(() => {
                                return;
                            });
                        }).catch((e) => {
                            return message.reply({
                                content: "An error has happend. Please join and tell the support server about the error. The support server link can be found on the docs."
                            }).catch(() => {
                                return;
                            });
                        });
                        break;

                        case "ban":
                            const user = message.mentions.members.first() || await this.client.users.fetch(args[2]);


                            if (!args[2]) {
                                return message.reply({
                                    content: "I need to know the user!"
                                }).catch((e) => {
                                    console.log(e)
                                    return;
                                });
                            };

                            if (!user) {
                                return message.reply({
                                    content: "This user might not exist"
                                }).catch((e) => {
                                    console.log(e)
                                    return;
                                });
                            };
                            const bans = await message.guild.bans.fetch();

                            // @ts-ignore
                            if(bans.find(b => b.user.id === user.id)) {
                                return message.channel.send({
                                    content: "User is already banned"
                                })
                            }
                            if (user.id === message.author.id) {
                                return message.reply({
                                    content: "You can't ban your self!"
                                });
                            };

                         /*
                            if (!user.bannable) {
                                return message.reply({
                                    content: "This user either has a higher permission then me or same permission as me meaning i am unable to ban them!"
                                }).catch(() => {
                                    return;
                                });
                            };
                          */

                            let banReason = args.slice(3).join(" ") || "No reason given";

                            return message.guild.members.ban(user,{
                                reason: banReason,
                            }).then(async () => {
                                await this.service.logger.modlogs({
                                    client: this.client,
                                    message: message,
                                    moderator: message.member,
                                    reason: banReason || null,
                                    //@ts-ignore
                                    user: String(user.tag),
                                    userid: String(user.id),
                                    title: 'Ban',
                                    color: '#dc3b3b',
                                    warn: true,
                                    timeout: false
                                })
                                return message.reply({
                                    content: "User has been banned."
                                }).catch((e) => {
                                    return message.reply({content: "Looks like there was an error banning the user."});
                                });
                            }).catch((e) => {
                                console.log(e)
                                return message.reply({
                                    content: "An error occurred."
                                }).catch(() => {
                                    return;
                                });
                            });
                        break;

                }
                break;

            case "delete":
                // @ts-ignore
                this.client.channels.cache.get(message.channel.id).messages.fetch(args[2]).then(message => message.delete({reason: args[3] || "No reason given"})).catch(() => {
                    return message.reply({
                        content: "An error occurred."
                    }).catch(() => {
                        return;
                    });
                });
                await message.reply("deleted")
                break

            case "build":
                message.channel.send("Building....")
                exec("yarn build", (err, stdout, stderr) => {
                    if (err) {
                        return message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription(`\`\`\`${err}\`\`\``)
                                //@ts-ignore
                                    .setColor(this.client.color.red)
                                    .setFooter({text: "Smooth brain, you failed."}),
                            ],
                        });
                    }
                    if(stdout) {
                         message.channel.send({
                            content: "Build successful!"
                        })

                        setTimeout(() => {
                             message.channel.send("Restarting...")
                            exec("pm2 restart 0")
                        }, 20000);
                    }
                });

                break;

            case "pull":
                exec("git pull", (err, stdout, stderr) => {
                    if (err) {
                        return message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription(`\`\`\`${err}\`\`\``)
                                //@ts-ignore
                                    .setColor(this.client.color.red)
                                    .setFooter({text: "Smooth brain, you failed."}),
                            ],
                        });
                    }
                    if (stdout) {
                        return message.channel.send({
                            content: `\`\`\`${stdout}\`\`\``
                        })

                    }
                })

                break
            default:
                return message.channel.send("Available args: `kick/ban` | `build` | `pull`");
                break;
        }
    };
};
