import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { Command } from "../../Command";
import Schema from "../../../models/tags";

export default class Tags extends Command {
    constructor(client) {
        super(client, {
            name: "tags",
            description: "Create, delete or list tags"
        });
    };

    async run(message: Message, args: string[]) {

        const input = (args[0]) ? args[0].toLowerCase() : args[0];

        switch (input) {
            case "list": {
                const data = await Schema.find({ Guild: message.guildId});

                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Custom Tags")
                            .setThumbnail(message.guild.iconURL({ dynamic: true }))
                            //@ts-ignore
                            .setColor(this.client.color.blue)
                            .setDescription(data.map((name) =>
                            `\`${name.Command}\``).join(' |') || "No tags found")
                    ]
                }).catch(() => {
                    return;
                });
            };

            break;

            case "create": {
                args.shift();

                if (!this.service.permission.checkForManagerRole(message, "MANAGE_GUILD", true)) {
                    return;
                };

                const tagName = args[0];

                if (!tagName) {
                    return message.reply({
                        content: "You did not say the tag name."
                    }).catch(() => {
                        return;
                    });
                };

                let check = await this.client.database.get.tag(message.guildId, tagName.toLowerCase());

                if (!check) {
                    check = await this.client.database.get.tag(message.guildId, tagName.toUpperCase());
                };

                if (check) {
                    return message.reply({
                        content: "That tag already exist"
                    }).catch(() => {
                        return;
                    });
                };

                const response = args.slice(1).join(" ");

                if (!response) {
                    return message.reply({
                        content: "You did not the say the argument"
                    }).catch(() => {
                        return;
                    });
                };

                this.client.database.create.tag(message.guildId, tagName.toLowerCase(), response);

                return message.reply({
                    content: "Changes Saved!"
                }).catch(() => {
                    return;
                });
            };

            break;

            case "delete": {
                args.shift();

                if (!this.service.permission.checkMember(message, "MANAGE_GUILD", true)) {
                    return;
                };

                const tagName = args[0];

                if (!tagName) {
                    return message.reply({
                        content: "You did not say the tag name."
                    }).catch(() => {
                        return;
                    });
                };

                let check = await this.client.database.get.tag(message.guildId, tagName.toLowerCase());

                if (!check) {
                    check = await this.client.database.get.tag(message.guildId, tagName.toLowerCase());
                };

                if (!check) {
                    return message.reply({
                        content: "That tag don't exist"
                    }).catch(() => {
                        return;
                    });
                };

                this.client.database.delete.tag(message.guildId, tagName);
                
                return message.reply({
                    content: "Changes Saved!"
                }).catch(() => {
                    return;
                });
            };

            break;

            default: {

                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Tags")
                            .setThumbnail(message.guild.iconURL({ dynamic: true }))
                            //@ts-ignore
                            .setColor(this.client.color.red)
                            .setDescription(`Arguments: \`list\` | \`create\` | \`delete\``)
                    ]
                }).catch(() => {
                    return;
                });
            };
        };
    };
};