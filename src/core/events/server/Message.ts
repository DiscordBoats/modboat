import { Message } from "discord.js";
import { Event } from "../../Event";

export default class Command extends Event {
    constructor (client) {
        super(client, {
            name: "messageCreate",
            once: false
        });
    };

    async run (message: Message) {
        if (message.author.bot) {
            return;
        };

        if (message.channel.type === "DM") {
            return;
        };

        if (!message.content.startsWith(process.env.Prefix)) {
            return;
        };

        const args = message.content.slice(process.env.Prefix.length).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase();

        const command = this.client.commands.get(String(commandName));

        if (command) {

            try {
                command.run(message, args);
            } catch (err) {
                console.log(err);
            };
            
        };
    };
};