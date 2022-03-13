import { Message } from "discord.js";
import { Command } from "../../Command";

const symbols = ["+", "-", "*", "/", "**", "++", "--", "%"];

export default class Purge extends Command {
    constructor (client) {
        super (client, {
            name: "purge",
            description: "Purge a number of messages",
            slash: {
                name: "purge",
                description: "Purge a number of messages",
                options: [
                    {
                        type: "NUMBER",
                        name: "messages",
                        description: "Number of messages to clear",
                        required: true
                    }
                ]
            }
        });
    };

    async run (message: Message, args: string[]) {

        if (!this.service.permission.checkForModeratorRole(message, "MANAGE_MESSAGES", true)) {
            return;
        };

        if (!this.service.permission.checkBot(message, "MANAGE_MESSAGES", true)) {
            return;
        };

        const amount: any = args[0];

        if (!amount) {
            return message.reply({
                content: "Amount Needed"
            });
        };
        
        if (amount < 1) {
            return message.reply({
                content: "1 to 100 can be cleared."
            }).catch(() => {
                return;
            });
        };

        if (isNaN(amount) || symbols.find((x) => amount.startsWith(x))) {
            return message.reply({
                content: "Amount can only be a number"
            }).catch(() => {
                return;
            });
        };

        if (amount > 100) {
            return message.reply({
                content: "Clearing messages over 100 is not possible at the moment."
            }).catch(() => {
                return;
            });
        };

        return message.channel.messages.fetch({
            limit: Number(amount)
        }).then((messages) => {
            message.channel["bulkDelete"](messages).then(() => {
                message.channel.send({
                    embeds: [
                        {
                            title: "Purged!",
                            //@ts-ignore
                            color: this.client.color.red,
                            description: `> Messages has been deleted`
                        }
                    ]
                }).catch(() => {
                    return;
                });
            }).catch(() => {
                return message.reply({
                    content: "Cannot delete messages that are over 14 days"
                });
            });
        });
    };
};