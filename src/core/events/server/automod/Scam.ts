import { Message } from "discord.js";
import { Event } from "../../../Event";
import settings from "../../../../settings/settings.json";
import Schema from "../../../../models/guild";

export default class Scam extends Event {
    constructor(client) {
        super(client, {
            name: "messageCreate",
            once: false
        });
    };

    async run(message: Message, args: string[]) {

        if (!message.guild) {
            return;
        };

        if (message.channel.type === "DM") {
            return;
        };

        if (message.author.bot) {
            return;
        };

        if (!message.guild.me.permissions.has("SEND_MESSAGES") || !message.guild.me.permissions.has("MANAGE_MESSAGES")) {
            return;
        };

        if (message.member.permissions.has("KICK_MEMBERS")) {
            return;
        };

        await Schema.findOne({ Guild: message.guild.id }, async (err, data) => {
            if (data && data.Automodscams == false) {
                return;
            };

            const res = this.client.fetch(process.env.Phish, {
                method: "POST",
                body: JSON.stringify({
                    message: message.content
                }),
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": process.env.Agent
                }
            }).then(r => r.json())
            console.log(res)
             //@ts-ignore
            if (res.match) {
                message.delete().catch(err => {
                    return;
                });
                message.channel.send({
                    content: `**:warning:  [AUTOMOD]** Scam link detected. (\`${message.author.tag}\`)`
                }).then(x => {

                    setTimeout(() => {

                        x.delete().catch(err => {
                            return;
                        });

                    }, 10000);

                }).catch(err => {
                    return;
                });
                try {
                    this.service.logger.modlogs({
                        client: this.client,
                        message: message,
                        moderator: message.guild.me,
                        reason: '[ Automod ] - User sent a scam link',
                        //@ts-ignore
                        user: String(message.author.tag),
                        userid: String(message.author.id),
                        title: 'Time Out',
                        color: '#fcffa4',
                        warn: false
                    })
                } catch (err) {
                    return;
                };
            };
        }).clone();
    };
}