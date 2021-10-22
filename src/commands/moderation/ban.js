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

            if (user.id === msg.author.id || user.id === client.user.id) {
                return msg.channel.send('You cannot ban the bot or yourself.');
            }
    
            if (user.roles.cache.find(r => r.id === client.config.modRole)) {
                return msg.channel.send('You cannot ban this user.');
            }

            if (ban) {
                return msg.channel.send('User is already banned');
            }

            msg.guild.members.ban(user, {
                reason: args.slice(1).join(' ')
            }).then((banned) => {
                msg.channel.send(`${user.tag} (${user.id}) has been banned.`);
                if (!client.settings.modlog) {
                    return;
                }

                client.channels.fetch(client.settings.modlog).then(channel => {
                    const latest = client.db.prepare('SELECT number FROM cases ORDER BY number DESC LIMIT 1').get() || { number: 0 };
                    const embed = {
                        color: 'dc3b3b',
                        author: {
                            name: 'Ban | Case #' + (latest.number + 1),
                            icon_url: msg.author.avatarURL()
                        },
                        description: `**User:** ${banned.tag} (${banned.id})\n**Moderator:** ${msg.author.tag} (${msg.author.id})\n**Reason:** ${args.slice(1).join(' ') || 'No reason provided. To provide a reason run +reason ' + (latest.number + 1)}`,
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
