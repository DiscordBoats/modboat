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
            if (data && data.Automodipv6 == false) {
                return;
            };
            
        try {

            const regex = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/

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
                    reason: '[ Automod ] - User sent IPv6 addresses.',
                    title: 'Time Out',
                    color: '#fcffa4'
                });
            };

        } catch (err) {
            return;
        };
        }).clone()
    };
}


// /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;