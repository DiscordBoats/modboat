import { Message, User } from "discord.js";
import { Command } from "../../Command";

export default class Unban extends Command {
    constructor(client) {
        super(client, {
            name: "unban",
            description: "unban a user",

        });
    };
    async run(message: Message, args: string[]) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || args[0]

        if (user) {
            const bans = await message.guild.bans.fetch();
            const ban = bans.find(b => b.user.id === user);

            if (!ban) {
                return message.channel.send("That user is not banned");
            }
            await message.guild.members.unban(ban.user.id, `${args.slice(1).join(' ') ? args.slice(1).join(' ') : 'No reason provided'} [${message.author.tag}}`).then(() => {
                message.channel.send(`\`${ban.user.tag}\` has been unbanned`);
            }).catch(err => {
                return message.channel.send(`An error occurred: ${err}`);
            });
            return await this.service.logger.modlogs({
                client: this.client,
                message: message,
                moderator: message.member,
                reason: null,
                //@ts-ignore
                user: String(ban.user.tag),
                userid: String(ban.user.id),
                title: 'Unban',
                color: '#70bd92',
                warn: true,
                timeout: false
            })


        } else {
            return message.channel.send("Please mention a user or provide a user ID");
        }


    }

}
