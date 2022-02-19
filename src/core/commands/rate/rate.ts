import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { Command } from "../../Command";

export default class Rate extends Command {
    constructor(client) {
        super(client, {
            name: "rate",
            description: "Set the config rates",
            slash: {
                name: "rate",
                description: "Configure the rates",
                options: [
                    {
                        type: "STRING",
                        name: "config",
                        description: "The rate of which config",
                        required: true,
                        choices: [
                            {
                                name: "Mass Mention",
                                value: "massmention"
                            },
                            {
                                name: "Mass Caps",
                                value: "masscaps"
                            }
                        ]
                    },
                    {
                        type: "NUMBER",
                        name: "limit",
                        description: "The rate amount",
                        required: true
                    }
                ]
            }
        });
    };

    async run(message: Message, args: string[]) {

        const input = (args[0]) ? args[0].toLowerCase() : args[0];

        switch (input) {
            case "masscaps": {
                args.shift();

                if (!this.service.permission.checkMember(message, "MANAGE_GUILD", true)) {
                    return;
                };

                const rate = args[0] as any;

                if (!rate || !validateRate(rate)) {
                    return message.reply({
                        content: "You have to give a valid rate"
                    }).catch(() => {
                        return;
                    });
                };

                this.client.database.update.rate(message.guildId, "Masscapsrate", rate);

                return message.reply({
                    content: "Changes Saved!"
                }).catch(() => {
                    return;
                });
            };

                break;

            case "massmentions": {
                args.shift();

                if (!this.service.permission.checkMember(message, "MANAGE_GUILD", true)) {
                    return;
                };

                const rate = args[0] as any;

                if (!rate || !validateRate(rate)) {
                    return message.reply({
                        content: "You have to give a valid rate"
                    }).catch(() => {
                        return;
                    });
                };

                this.client.database.update.rate(message.guildId, "Massmentionrate", rate);

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
                            .setTitle("Rate")
                            .setThumbnail(message.guild.iconURL({ dynamic: true }))
                            //@ts-ignore
                            .setColor(this.client.color.red)
                            .setDescription("`masscaps` | `massmentions`")
                    ]
                }).catch(() => {
                    return;
                });
            };
        };
    };

    async interact(i: CommandInteraction) {

        const input = i.options.getString("config", true);
        const rate = i.options.getNumber("limit", true);

        switch (input) {
            case "masscaps": {

                if (!this.service.permission.checkMember(i, "MANAGE_GUILD", true)) {
                    return;
                };

                if (!validateRate(String(rate))) {
                    return i.reply({
                        content: "You have to give a valid rate"
                    }).catch(() => {
                        return;
                    });
                };

                this.client.database.update.rate(i.guildId, "Masscapsrate", rate);

                return i.reply({
                    content: "Changes Saved!"
                }).catch(() => {
                    return;
                });
            };

                break;

            case "massmentions": {

                if (!this.service.permission.checkMember(i, "MANAGE_GUILD", true)) {
                    return;
                };

                if (!validateRate(String(rate))) {
                    return i.reply({
                        content: "You have to give a valid rate"
                    }).catch(() => {
                        return;
                    });
                };

                this.client.database.update.rate(i.guildId, "Massmentionrate", rate);

                return i.reply({
                    content: "Changes Saved!"
                }).catch(() => {
                    return;
                });
            };
        };
    };
};

function validateRate(rate: string): boolean {

    if (isNaN(rate as any)) {
        return false;
    };

    const symbols = ["+", "-", ">", "<", "*", "/"];

    if (symbols.find((x) => rate.startsWith(x))) {
        return false;
    };

    return true;
};