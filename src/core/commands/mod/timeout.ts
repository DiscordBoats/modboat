import { Message } from "discord.js";
import { Command } from "../../Command";

export default  class  Timeout extends Command {
    constructor(client) {
        super(client, {
            name: "timeout",
            description: "Timeouts a user"
        });
    }

    async run(message: Message, args: string[]) {
        if (!this.service.permission.checkMember(message, "MODERATE_MEMBERS", true)) {
            return;
        };

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(" ");
        this.service.timeout(message.guild.id, member.id)
        return message.channel.send({
            content: `**${member}** has been timed out`
        }).then(async () => {
            await this.service.logger.modlogs({
                client: this.client,
                message: message,
                reason: reason || null,
                moderator: message.member,
                //@ts-ignore
                user: String(member.user.tag),
                userid: String(member.user.id),
                title: 'Time Out',
                color: '#fcffa4',
            })
        })
    }
}
