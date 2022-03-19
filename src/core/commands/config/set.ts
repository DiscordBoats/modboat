import {CommandInteraction, Message, MessageEmbed} from "discord.js";
import { Command } from "../../Command";

export default class set extends Command {
    constructor (client) {
        super(client, {
            name: "set",
            description: "Set a config",
        });
    };
    async run(message: Message, args: string[]) {
        if (!await this.service.permission.checkForManagerRole(message, "MANAGE_GUILD", true)) {
            return;
        };
        const input = (args[0]) ? args[0].toLowerCase() : args[0];

        switch (input) {
            case 'type':
                const typeinput = (args[1]) ? args[1].toLowerCase() : args[1];
                switch (typeinput) {
                    case 'alts': {
                        const arg = args[2];
                        if (!arg) {
                            return message.reply({
                                content: 'You need to specify either `kick` or `ban`'
                            })
                        }
                        if (arg == 'kick') {
                             this.client.database.update.altType(message.guildId, "kick")
                            return message.reply({
                                content: 'Changes Saved!'
                            });
                        };

                        if (arg == 'ban') {
                             this.client.database.update.altType(message.guildId, "ban")
                             return message.reply({
                                 content: 'Changes Saved!'
                             });
                        };
                    }
                } 
                break;
            case 'role':
                const roleinput = (args[1]) ? args[1].toLowerCase() : args[1];
                switch (roleinput) {
                    case 'muterole': {
                        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
                        if (!role) {
                            return message.reply({
                                content: 'You have to mention a role'
                            });
                        };
                        await this.client.database.update.muterole(message.guildId, role.id);
                        return message.reply({
                            content: 'Changes Saved!'
                        });
                    };
                    break;
                }
                break;
            case 'channel':
                const channelinput = (args[1]) ? args[1].toLowerCase() : args[1];
                switch (channelinput) {
                    case 'logs': {
                        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
                        if (!channel) {
                            return message.reply({
                                content: 'You have to mention a channel'
                            });
                        };
                        await this.client.database.update.logs(message.guildId, channel.id);
                        return message.reply({
                            content: 'Changes Saved!'
                        });
                    };
                    break;
                    case 'modlogs': {
                        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
                        if (!channel) {
                            return message.reply({
                                content: 'You have to mention a channel'
                            });
                        };
                        await this.client.database.update.modlogs(message.guildId, channel.id);
                        return message.reply({
                            content: 'Changes Saved!'
                        });
                    };
                    break;
                    case 'alts': {
                        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
                        if (!channel) {
                            return message.reply({
                                content: 'You have to mention a channel'
                            });
                        };
                        await this.client.database.update.alts(message.guildId, channel.id)
                        return message.reply({
                            content: 'Changes Saved!'
                        });
                    }
                }
                break;
                case 'dm': {
                    const dminput = (args[1]) ? args[1].toLowerCase() : args[1];
                    switch(dminput) {
                        case 'kick': {
                            if (args[2] === 'text') {
                                const arg = args.slice(3).join(" ");
                                if (!arg) {
                                    return message.reply({
                                        content: 'You need to provide text for the kick dm message'
                                    });
                                };

                                if (arg.length > 1020) {
                                    return message.reply({
                                        content: 'Your kick text is too long (over 1020 chars)'
                                    })
                                }
                                this.client.database.update.kickDMText(message.guildId, arg)
                                return message.reply({
                                    content: 'Changes Saved!'
                                }).catch(() => {
                                    return;
                                });
                            };
                            if (args[2] === 'enable') {
                                await this.client.database.update.kickDM(message.guildId, true)
                                return message.reply({
                                    embeds: [
                                        {
                                            //@ts-ignore
                                            color: this.client.color.red,
                                            description: `> Successfully enabled kickdm`
                                        }
                                    ]
                                });
                            };

                            if (args[2] === 'disable') {
                                await this.client.database.update.kickDM(message.guildId, false)
                                return message.reply({
                                    embeds: [
                                        {
                                            //@ts-ignore
                                            color: this.client.color.red,
                                            description: `> Successfully disabled kickdm`
                                        }
                                    ]
                                });
                            };
                        };
                        break;
                        case 'ban': {
                            if (args[2] === 'text') {
                                const arg = args.slice(3).join(" ");
                                if (!arg) {
                                    return message.reply({
                                        content: 'You need to provide text for the ban dm message'
                                    });
                                };

                                if (arg.length > 1020) {
                                    return message.reply({
                                        content: 'Your kick text is too long (over 1020 chars)'
                                    })
                                }
                                this.client.database.update.banDMText(message.guildId, arg)
                                return message.reply({
                                    content: 'Changes Saved!'
                                }).catch(() => {
                                    return;
                                });
                            };
                            if (args[2] === 'enable') {
                                await this.client.database.update.banDM(message.guildId, true)
                                return message.reply({
                                    embeds: [
                                        {
                                            //@ts-ignore
                                            color: this.client.color.red,
                                            description: `> Successfully enabled bandm`
                                        }
                                    ]
                                });
                            };

                            
                            if (args[2] === 'disable') {
                                await this.client.database.update.banDM(message.guildId, false)
                                return message.reply({
                                    embeds: [
                                        {
                                            //@ts-ignore
                                            color: this.client.color.red,
                                            description: `> Successfully disabled bandm`
                                        }
                                    ]
                                });
                            };
                        }
                    };
                }
            default: {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setURL('https://docs.antibot.xyz/anti-bot/config')
                            .setTitle("Configurations")
                            .setThumbnail(message.guild.iconURL( { dynamic: true}))
                            //@ts-ignore
                            .setColor(this.client.color.red)
                            .setDescription(`Arguments: \`type <alts>\` | \`channel <logs | modlogs>\` | \`role <muterole>\``)
                    ]
                })
            }
        }

    }
};