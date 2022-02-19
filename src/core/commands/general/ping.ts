import { Interaction, Message } from "discord.js";
import { Command } from "../../Command";


export default class ping extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            description: "Ping of the modboat",
            slash: {
                name: "ping",
                description: "Ping of the modboat"
            }
        });
    };

    async run(message: Message) {
        return message.channel.send({
            content: `${Date.now() - message.createdTimestamp} ping`
        });
    };
};