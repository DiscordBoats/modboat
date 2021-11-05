module.exports = {
    name: 'vckick',
    description: 'Kicks a user from voice.',
    usage: '[user mention or id] [reason]',
    category: 'Moderation',
    permissions: ['KICK_MEMBERS'],
    async execute(client, msg, args) {
        const user = msg.mentions.users.first() ? msg.mentions.users.first().id : args[0];

        if (user === 'all') {
            msg.guild.members.cache.forEach(async (member) => {
                if (member.voice.channel) {
                    await member.voice.kick();
                }
            });
            return msg.channel.send('All users have been kicked from voice.');
        }

        const member = msg.guild.member(user);
        if (member) {
            if (!member.kickable) {
                return msg.channel.send('You cannot kick this user.');
            }

            if (member.id === msg.author.id || member.id === client.user.id) {
                return msg.channel.send('You cannot kick the bot or yourself.');
            }

            if (client.settings.modrole) {
                if (member.roles.cache.has(client.settings.modrole)) {
                    return msg.channel.send('You cannot kick this user.');
                }
            }

            member.voice.kick().then(() => {
                msg.channel.send(`${user.tag} (${user.id}) has been kicked from voice chat.`);
            });
        } else {
            msg.channel.send('No user provided');
        }
    }
};
