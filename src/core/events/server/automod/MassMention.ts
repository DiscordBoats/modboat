import { Message } from "discord.js";
import { Event } from "../../../Event";
import Schema from "../../../../models/guild";

export default class MassMention extends Event {
    constructor (client) {
        super(client, {
            name: "messageCreate",
            once: false
        });
    };

    async run (message: Message) {

        if (message.channel.type === "DM") {
            return;
        };

        if (message.author.bot) {
            return;
        };

        if (message.member.permissions.has("KICK_MEMBERS") || message.member.permissions.has("BAN_MEMBERS")) {
            return;
        };

        await Schema.findOne({ Guild: message.guild.id }, async (err, data) => {
            if (data && data.Automodmassmention == false) {
                return;
            };
            const regex = /<@![0-9]{18}>/gm;

        try {

            var invalid = message.content.match(regex != null && regex).length >= data.Massmentionrate;

            if (!invalid) {
                return;
            } else {
                message.delete().catch(() => {
                    return;
                });

                message.channel.send(`**:warning:  [AUTOMOD]** Mass Mention is not allowed.(\`${message.author.tag}\`)`)
                .then((x) => {
                    
                    setTimeout(() => {
                        x.delete().catch(() => {
                            return;
                        });
                    }, 10000);
                }).catch(() => {
                    return;
                });

                this.service.logger.modlogs({
                    client: this.client,
                    message: message,
                    moderator: message.guild.me,
                    reason: `[ Automod ] - User Mass Mentioned at least ${data.Massmentionrate} user(s).`,
                    //@ts-ignore
                    user: String(message.author.tag),
                    userid: String(message.author.id),
                    title: 'Time Out',
                    color: '#fcffa4',
                    warn: true,
                    timeout: true
                });
            };

        } catch (err) {
            return;
        };
        }).clone()
    };
};