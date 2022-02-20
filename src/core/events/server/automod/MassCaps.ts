import { Message, MessageEmbed } from "discord.js";
import { Event } from "../../../Event";

import Schema from "../../../../models/guild";

export default class MassCaps extends Event {
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

        if (message.member.permissions.has("KICK_MEMBERS") || message.member.permissions.has("BAN_MEMBERS")) {
            return;
        };

        await Schema.findOne({ Guild: message.guild.id }, async (err, data) => {
            if (data && data.Automodmasscaps == false) {
                return;
            };
            try {

                const regex = /[A-Z]/g;
    
                const invalid = message.content.match(regex).length >= data.Masscapsrate;
    
                if (!invalid) {
                    return;
                } else {
                    message.delete().catch(() => {
                        return;
                    });
    
                    message.channel.send(`**:warning:  [AUTOMOD]** Mass Caps is not allowed.(\`${message.author.tag}\`)`)
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
                    await this.service.logger.modlogs({
                        client: this.client,
                        message: message,
                        moderator: message.guild.me,
                        reason: `[ Automod ] - User used to many caps.....at least ${data.Masscapsrate} cap(s).`,
                        //@ts-ignore
                        user: String(message.author.tag),
                        userid: String(message.author.id),
                        title: 'Time Out',
                        color: '#fcffa4',
                        warn: true
                    });
                };
    
            } catch (err) {
                return;
            };
        }).clone()

    };
};