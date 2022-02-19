import { Message } from "discord.js";
import { Event } from "../../Event";

const cooldown = new Set();

export default class ping extends Event {
    constructor(client) {
        super(client, {
            name: "messageCreate",
            once: false
        });
    };

    async run(message: Message) {

        if (!message.guild) {
            return;
        };

        if (message.author.bot) {
            return;
        };

        if (message.channel.type !== "GUILD_TEXT") {
            return;
        };

        if (!message.guild.me.permissions.has("SEND_MESSAGES")) {
            return;
        };

        if (message.content === `<@!${this.client.user.id}>`) {

            if (cooldown.has(message.author.id)) {
                return;
            };

            cooldown.add(message.author.id);
            setTimeout(() => {
                cooldown.delete(message.author.id);
            }, 10000);

            return message.channel.send({
                content: `You can do "_help" or check out our docs. https://docs.antibot.xyz/`
            }).catch(err => {
                return;
            });
        };
    };
};