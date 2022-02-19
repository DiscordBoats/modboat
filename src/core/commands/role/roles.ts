import  { Message, MessageEmbed } from "discord.js";
import { Command } from "../../Command";
import Schema from "../../../models/guild";
import moment from "moment";

export default class Role extends Command {
    constructor(client) {
        super (client, {
            name: "roles",
            description: "Roles",
            slash: {
                name: "roles",
                description: "Roles",
                options: [
                    {
                        type: "STRING",
                        name: "action",
                        description: "Options of role features",
                        required: true,
                        choices: [
                            {
                                name: "Display All",
                                value: "displayall"
                            }
                        ]
                    }
                ]
            }
        })
    }

    async run(message: Message, args: string[]) {

        const input = (args[0]) ? args[0].toLowerCase() : args[0];

        // @ts-ignore
        switch (input) {
            default: {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setURL('https://docs.antibot.xyz/anti-bot/roles')
                        .setTitle("Roles")
                        .setThumbnail(message.guild.iconURL({ dynamic: true }))
                        //@ts-ignore
                        .setColor(this.client.color.red)
                        .setDescription(`Arguments: \`displayall\` | \`add\` | \`romove\` | \`info\`| \`autorole\``)
                        .addFields({
                            name: "Autorole Subs",
                            value: "[`✅ enable`](https://docs.antibot.xyz/anti-bot/roles)\n[`⛔ disable`](https://docs.antibot.xyz/anti-bot/roles)\n[`📝 list`](https://docs.antibot.xyz/anti-bot/roles)\n[`➕ add`](https://docs.antibot.xyz/anti-bot/roles)\n[`❌ remove`](https://docs.antibot.xyz/anti-bot/roles)"
                        }),
                        
                    ]
                })
            }
            case "displayall": {
                args.shift();

                const array = [];

                message.guild.roles.cache.map((x, i) => {
                    array.push(`<@&${x.id}>`)
                });

                const roles = array.toString()
                    .replace(",", " ");

                message.channel.send({
                    embeds: [
                        {
                            title: "Roles",
                            //@ts-ignore
                            color: this.client.color.green,
                            description: (roles.length > 4086) ? roles.slice(0, 4086).substr(0, 4070) + "..." : roles
                        }
                    ]
                })
            }
                break;
            case "add": {
                const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
                const member = message.mentions.members.first() || message.guild.members.cache.get(args[3]);
                if (!this.service.permission.checkMember(message, "MANAGE_ROLES", true)) {
                    return;
                }
                if (!this.service.permission.checkBot(message, "MANAGE_ROLES", true)) {
                    return;
                };

                if (!message.guild.me.roles.highest.permissions.has("MANAGE_ROLES")) {
                    return message.reply({
                        content: 'Due to how discord works, for this command my role needs to have the `MANAGE_ROLES` permission.'
                    })
                }
                if (!role) {
                    return message.reply({
                        content: 'You have to mention a role'
                    })
                }

                if (role.editable == false) {
                    return message.reply({
                        content: 'This role is too high for me to add'
                    })
                }

                if (!member.manageable) {
                    return message.reply({
                        content: 'This member is too high in either permissions or roles'
                    })
                }
                if (!member) {
                    return message.reply({
                        content: 'You have to mention a member'
                    })
                }

                if (member.roles.cache.has(role.id)) {
                    return message.reply({
                        content: 'This member already has that role'
                    })
                }
                await member.roles.add(role).catch(() => {
                    message.reply({
                        content: 'Looks like an error occurred. If you need help with this, please contact us: <https://vultrex.dev/discord>'
                    })
                }).then(() => {
                    return message.reply({
                        embeds: [
                            {
                                //@ts-ignore
                                color: this.client.color.red,
                                description: `> Successfully added <@&${role.id}> to ${member}`
                            }
                        ]
                    })
                })

            }
                break;
            case 'remove': {
                const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
                const member = message.mentions.members.first() || message.guild.members.cache.get(args[3]);
                if (!this.service.permission.checkMember(message, "MANAGE_ROLES", true)) {
                    return;
                }
                if (!this.service.permission.checkBot(message, "MANAGE_ROLES", true)) {
                    return;
                };

                if (!message.guild.me.roles.highest.permissions.has("MANAGE_ROLES")) {
                    return message.reply({
                        content: 'Due to how discord works, for this command my role needs to have the `MANAGE_ROLES` permission.'
                    })
                }
                if (!role) {
                    return message.reply({
                        content: 'You have to mention a role'
                    })
                }

                if (role.editable == false) {
                    return message.reply({
                        content: 'This role is too high for me to add'
                    })
                }

                if (!member.manageable) {
                    return message.reply({
                        content: 'This member is too high in either permissions or roles'
                    })
                }
                if (!member) {
                    return message.reply({
                        content: 'You have to mention a member'
                    })
                }

                if (!member.roles.cache.has(role.id)) {
                    return message.reply({
                        content: 'This member doesn\'t have that role'
                    })
                }
                await member.roles.remove(role).catch(() => {
                    message.reply({
                        content: 'Looks like an error occurred. If you need help with this, please contact us: <https://vultrex.dev/discord>'
                    })
                }).then(() => {
                    return message.reply({
                        embeds: [
                            {
                                //@ts-ignore
                                color: this.client.color.red,
                                description: `> Successfully removed <@&${role.id}> from ${member}`
                            }
                        ]
                    })
                })
            }
                break;
            case 'info': {
                const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
                if (!role) {
                    return message.reply({
                        content: 'You have to mention a role'
                    })
                }
                message.channel.send({
                    embeds: [
                        {
                            title: role.name,
                            color: role.hexColor,
                            fields: [
                                {
                                    name: "Hex Color",
                                    value: role.hexColor,
                                    inline: true
                                },
                                {
                                    name: "Hoisted",
                                    value: String(role.hoist),
                                    inline: true
                                },
                                {
                                    name: "Position",
                                    value: String(role.position),
                                    inline: true
                                },
                                {
                                    name: "Mentionable",
                                    value: String(role.mentionable),
                                    inline: true
                                },
                                {
                                    name: "CreateAt",
                                    value: moment(role.createdAt).format("MM/DD/YYYY"),
                                    inline: true
                                },
                                {
                                    name: "Members",
                                    value: String(role.members.size),
                                    inline: true
                                }
                            ]
                        }
                    ]
                })
            }
                break;
            case 'autorole': {
                switch (args[1]) {
                    case 'add': {
                        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
                        if (!this.service.permission.checkMember(message, "MANAGE_ROLES", true)) {
                            return;
                        }
                        if (!this.service.permission.checkBot(message, "MANAGE_ROLES", true)) {
                            return;
                        }
                        ;

                        if (!message.guild.me.roles.highest.permissions.has("MANAGE_ROLES")) {
                            return message.reply({
                                content: 'Due to how discord works, for this command my role needs to have the `MANAGE_ROLES` permission.'
                            })
                        }
                        if (!role) {
                            return message.reply({
                                content: 'You have to mention a role'
                            })
                        }

                        if (role.editable == false) {
                            return message.reply({
                                content: 'This role is too high for me to use for autorole'
                            })
                        }

                        Schema.findOne({Guild: message.guild.id}, (err, data) => {
                            if (data.Autoroles.length > 4) {
                                return message.reply({
                                    content: 'You can only have 5 autoroles'
                                })
                            }
                            if (!data) {
                                new Schema({
                                    Guild: message.guild.id,
                                    Autoroles: [role.id]
                                })
                                 message.reply({
                                    content: 'Changes Saved!'
                                })
                            } else {
                                data.Autoroles.push(role.id);
                                message.reply({
                                    content: 'Changes Saved!'
                                })
                                data.save()
                            }
                        })
                    }
                        break;
                    case 'remove': {
                        const number = parseInt(args[2])
                        if (!number) {
                            return message.reply({
                                content: 'You must say the number of role on the autorole list'
                            })
                        }
                        Schema.findOne({Guild: message.guild.id}, (err, data) => {
                            if (data) {
                                data.Autoroles.splice(number - 1, 1);
                                message.reply({
                                    content: 'Changes Saved!'
                                })
                            } else {
                                message.reply({
                                    content: 'That role doesn\'t exist on the list.'
                                })
                            };
                            data.save()
                        })
                    }
                        break;
                    case 'list': {
                        const autoroles = await Schema.findOne({ Guild: message.guild.id })
                        return message.channel.send({
                            embeds: [
                                {
                                    title: 'Auto Roles',
                                    //@ts-ignore
                                    color: this.client.color.green,
                                    description: String(autoroles.Autoroles.map(
                                        (x, i) =>
                                            `\`${i + 1}\`. <@&${x}> - ${x}`.toString()).join('\n') || 'No roles found.'
                                    )
                                }
                            ]
                        })

                    }
                    break;
                    case 'enable': {
                        this.client.database.update.autorole(message.guild.id, true)
                        return message.reply({
                            embeds: [
                                {
                                    //@ts-ignore
                                    color: this.client.color.red,
                                    description: '> Successfully enabled autoroles'
                                }
                            ]
                        })
                    }
                    break;
                    case 'disable': {
                        this.client.database.update.autorole(message.guild.id, false)
                        return message.reply({
                            embeds: [
                                {
                                    //@ts-ignore
                                    color: this.client.color.red,
                                    description: '> Successfully disabled autoroles'
                                }
                            ]
                        })
                    }
                    default: {
                        return message.reply({
                            embeds: [
                                new MessageEmbed()
                                .setURL('https://docs.antibot.xyz/anti-bot/roles')
                                .setTitle("Roles")
                                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                //@ts-ignore
                                .setColor(this.client.color.red)
                                .setDescription(`Arguments: \`enable\` | \`disable\` | \`list\` | \`add\` | \`remove\``)
                                
                            ]
                        })
                    }
                }
            }
        }
    }
}