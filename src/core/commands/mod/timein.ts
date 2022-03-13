import { Message } from "discord.js";
import { Command } from "../../Command";

export default class Timein extends Command {
    constructor(client) {
        super(client, {
            name: "timein",
            description: "Timeins a user"
        });
    }

    async run(message: Message, args: string[]) {


        if (!await this.service.permission.checkForModeratorRole(message, "KICK_MEMBERS", true)) {
            return;
        }
        ;

        if (!this.service.permission.checkBot(message, "KICK_MEMBERS", true)) {
            return;
        }
        ;


        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!args[0]) {
            return message.reply({
                content: 'I need to know the user!'
            });
        }
        ;

        if (!member) {
            return message.reply({
                content: "This user might not be in the server!"
            }).catch(() => {
                return;
            });
        }
        ;
        let reason = args.slice(1).join(" ");
        await this.service.timein(message.guild.id, member.id)
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
                color: '#70bd92',
                warn: false,
                timeout: false
            })
        })
    }

}