import { GuildMember, Message, TextChannel } from "discord.js";
import { Event } from "../../../Event";
import settings from "../../../../settings/settings.json";
import fetch from "cross-fetch";
import Schema from "../../../../models/guild";

export default class Nword extends Event {
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
            if (data && data.Automodnword == false) {
                return;
            };
            if (settings.automod.nword.some(word => message.content.toLowerCase().includes(word))) {

                message.delete().catch(err => {
                    return;
                });

                message.channel.send({
                    content: `**:warning:  [AUTOMOD]** The N-word is not allowed. (\`${message.author.tag}\`)`,
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
                    ;
                    this.service.logger.modlogs({
                        client: this.client,
                        message: message,
                        moderator: message.guild.me,
                        reason: '[ Automod ] - User sent the nword',
                        //@ts-ignore
                        user: String(message.author.tag),
                        userid: String(message.author.id),
                        title: 'Time Out',
                        color: '#fcffa4',
                        warn: true
                    });

                } catch (err) {
                    return;
                };
            };
        }

        ).clone()
    }
}




