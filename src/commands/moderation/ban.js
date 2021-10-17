module.exports = {
    name: 'ban',
    description: 'Bans a user.',
    usage: '[user mention or id] [reason]',
    category: 'Moderation',
    permissions: ['BAN_MEMBERS'],
    async execute(client, msg, args) {
        const user = msg.mentions.users.first() ? msg.mentions.users.first().id : args[0];
        if (user) {
            const bans = await msg.guild.fetchBans();
            const ban = bans.find(b => b.user.id === user);
            if (!user.kickable) return msg.channel.send('You can not ban/kick a moderator.')
            if (ban) {
                return msg.channel.send('User is already banned');
            }

            msg.guild.members.ban(user, {
                reason: args.slice(1).join(' ')
            }).then((banned) => {
                msg.channel.send(`${user} has been banned.`);
                client.channels.fetch(client.config.modlog).then(channel => {
                    const latest = client.db.prepare('SELECT number FROM cases ORDER BY number DESC LIMIT 1').get();
                    const embed = {
                        color: 'dc3b3b',
                        author: {
                            name: 'Ban | Case #' + (latest.number + 1),
                            icon_url: msg.author.avatarURL()
                        },
                        description: `**User:** ${banned.tag} (${banned.id})\n**Moderator:** ${msg.author.tag} (${msg.author.id})\n**Reason:** ${args.slice(1).join(' ') || 'No reason provided'}`,
                        footer: {
                            text: msg.guild.name,
                            icon_url: msg.guild.iconURL()
                        }
                    }
                    channel.send({
                        embed
                    }).then(message => {
                        client.db.prepare('INSERT INTO cases (message_id) VALUES (?)').run(message.id);
                    });
                });
            });
        } else {
            msg.channel.send('No user provided');
        }
    }
};
