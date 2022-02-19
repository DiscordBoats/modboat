import { Message } from "discord.js";
import { Command } from "../../Command";

export default class Timein extends Command {
    constructor(client) {
        super(client, {
            name: "timein",
            description: "Timeouts a user"
        });
    }

    async run(message: Message, args: string[]) {
        if (!this.service.permission.checkMember(message, "MODERATE_MEMBERS", true)) {
            return;
        };

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(" ");
        this.service.timein(message.guild.id, member.id)
        return message.channel.send({
            content: `**${member}** has been timed in`
        }).then(async () => {
            await this.service.logger.modlogs({
                client: this.client,
                message: message,
                reason: reason || null,
                moderator: message.member,
                //@ts-ignore
                user: String(member.user.tag),
                userid: String(member.user.id),
                title: 'Timed In',
                color: '#70bd92'
            })
        })
    }
}
