import { Message } from "discord.js";
import Schema from "../../../../models/guild";

import { Event } from "../../../Event";

let grabifyLinks = [
    "viral.over-blog.com",
    "gyazo.in",
    "ps3cfw.com",
    "urlz.fr",
    "webpanel.space",
    "steamcommumity.com",
    "i.imgur.com.de",
    "www.fuglekos.com",
    "grabify.link",
    "leancoding.co",
    "stopify.co",
    "freegiftcards.co",
    "joinmy.site",
    "curiouscat.club",
    "catsnthings.fun",
    "catsnthings.com",
    "xn--yutube-iqc.com",
    "gyazo.nl", "yip.su",
    "iplogger.com",
    "iplogger.org",
    "iplogger.ru",
    "2no.co",
    "02ip.ru",
    "iplis.ru",
    "iplo.ru",
    "ezstat.ru",
    "www.whatstheirip.com",
    "www.hondachat.com",
    "www.bvog.com",
    "www.youramonkey.com",
    "pronosparadise.com",
    "freebooter.pro",
    "blasze.com",
    "blasze.tk",
    "ipgrab.org",
    "i.gyazos.com"
];

export default class IpLogger extends Event {
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
            if (data && data.Automodiploggers == false) {
                return;
            };
            if (grabifyLinks.some(link => message.content.toLowerCase().includes(link))) {

                try {
    
                    message.channel.send(`**:warning:  [AUTOMOD]** IP loggers are not allowed.(\`${message.author.tag}\`)`)
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
                        reason: '[ Automod ] - User sent IP loggers.',
                        //@ts-ignore
                        user: String(message.author.tag),
                        userid: String(message.author.id),
                        title: 'Time Out',
                        color: '#fcffa4',
                        warn: true
                    });
    
                    message.delete().catch(() => {
                        return;
                    });
    
                } catch (err) {
                    return;
                };
            };
        }).clone()

    };
};