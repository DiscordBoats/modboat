import { Message } from "discord.js";
import { Event } from "../../../Event";
import Schema from "../../../../models/guild";

const words = [
    "nigger",
    "Nigger",
    "nigg3r",
    "ni44er",
    "ni66er",
    "n1gger",
    "ni_gger",
    "nigga",
    "ni44a",
    "nigg4",
    "nigga",
    "niger",
    "niga",
    "n.ig..ga",
    "niggers"
];

export default class AutomodNword extends Event {
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

        if (message.channel.type === "DM") {
            return;
        };

        if (message.member.permissions.has("KICK_MEMBERS") || message.member.permissions.has("BAN_MEMBERS")) {
            return;
        };

        await Schema.findOne({ Guild: message.guild.id }, async (err, data) => {

            if (!data && data.Automodnword == false) {
                return;
            };

            if (words.some(w => message.content.toLowerCase().includes(w))) {

                try {

                    message.channel.send(`**:warning:  [AUTOMOD]** The N-word is not allowed.(\`${message.author.tag}\`)`)
                        .then((x) => {
                            setTimeout(() => {
                                x.delete().catch(() => {
                                    return;
                                });
                            }, 5000);
                        }).catch(() => {
                            return;
                        });

                    this.service.logger.modlogs({
                        client: this.client,
                        message: message,
                        moderator: message.guild.me,
                        reason: '[ Automod ] - User sent the nword',
                        title: 'Time Out',
                        color: '#fcffa4'
                    });

                    message.delete().catch(() => {
                        return;
                    });

                } catch (err) {
                    return;
                };
            };
        }).clone();
    };
};