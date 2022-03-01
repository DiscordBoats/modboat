import { Message } from "discord.js";
import { Event } from "../../../Event";

import Schema from "../../../../models/guild";

export default class MassCaps extends Event {
    constructor(client) {
        super(client, {
            name: "messageCreate",
            once: false
        });
    };

    async run(message: Message) {
        
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
            if (data && data.Automodipv4 == false) {
                return;
            };
            try {

                const regex = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/;
    
                const invalid = message.content.match(regex != null && regex);
    
                if (!invalid) {
                    return;
                } else {
                    message.delete().catch(() => {
                        return;
                    });
    
                    message.channel.send(`**:warning:  [AUTOMOD]** Potential IPv4 Addresses are not allowed.(\`${message.author.tag}\`)`)
                        .then((x) => {
                            setTimeout(() => {
                                x.delete().catch(() => {
                                    return;
                                });
                            }, 10000);
                        })
                        .catch(() => {
                            return;
                        });
    
                    this.service.logger.modlogs({
                        client: this.client,
                        message: message,
                        moderator: message.guild.me,
                        reason: '[ Automod ] - User sent IPv4 addresses.',
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
}
