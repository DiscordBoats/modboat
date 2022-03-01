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
        if (!this.service.permission.checkMember(message, "KICK_MEMBERS", true)) {
            return;
        };

        if (!this.service.permission.checkBot(message, "KICK_MEMBERS", true)) {
            return;
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!args[0]) {
            return message.reply({
                content: 'I need to know the user!'
            });
        };

        if (!member) {
            return message.reply({
                content: "This user might not be in the server!"
            }).catch(() => {
                return;
            });
        };
        if (!member.moderatable) {
            return message.reply({
                content: "This user either has a higher permission then me or same permission as me meaning i am unable to time them out them!"
            });
        };
        let reason = args.slice(1).join(" ");
        await this.service.timeout(message.guild.id, member.id)
        return message.reply({
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
