
module.exports = {
    name: 'ban',
    description: 'Bans a user.',
    usage: '[user mention or id] [reason]',
    category: 'Moderation',
    permissions: ['BAN_MEMBERS'],
    async execute(client, msg, args) {
        try {

        const user = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || args[0]

        if (user) {
            const bans = await msg.guild.fetchBans();
            const ban = bans.find(b => b.user.id === user);

            if (user.id === msg.author.id || user.id === client.user.id) {
                return msg.channel.send('You cannot ban the bot or yourself.');
            }

            if (client.settings.modrole) {
                if (user.roles.cache.has(client.settings.modrole)) {
                    return msg.channel.send('You cannot ban this user.');
                }
            }

            if (ban) {
                return msg.channel.send('User is already banned');
            }
            await user.send('You have been banned from **' + msg.guild.name + '** for: ' + args.slice(1).join(' '))
                .catch(() => {
                    return msg.channel.send('Unable to send ban message to user.');
                });
            msg.channel.messages.fetch({
                limit: 100
            }).then((messages) => {
                const Messages = [];
                messages.filter(m => m.author.id === user.user.id).forEach(msg => Messages.push(msg))
                msg.channel.bulkDelete(Messages)
            })

            msg.guild.members.ban(user, {
                reason: `${args.slice(1).join(' ') ? args.slice(1).join(' ') : 'No reason provided'} [${msg.author.tag}]`
            }).then((banned) => {
                msg.channel.send(`${user.user.tag} (${user.user.id}) has been banned.`);
                if (!client.settings.modlog) {
                    msg.channel.send(`Looks like a mod log channel hasn't been set!`);
                }

                return client.channels.fetch(client.settings.modlog).then(channel => {
                    const latest = client.db.prepare('SELECT number FROM cases ORDER BY number DESC LIMIT 1').get() || {number: 0};
                    const embed = {
                        color: 'dc3b3b',
                        author: {
                            name: 'Ban | Case #' + (latest.number + 1),
                            icon_url: msg.author.avatarURL()
                        },
                        description: `**User:** ${banned.user.tag} (${banned.user.id})\n**Moderator:** ${msg.author.tag} (${msg.author.id})\n**Reason:** ${args.slice(1).join(' ') || 'No reason provided. To provide a reason run +reason ' + (latest.number + 1)}`,
                        footer: {
                            text: msg.guild.name,
                            icon_url: msg.guild.iconURL()
                        }
                    }
                    return channel.send({
                        embed
                    }).then(message => {
                        client.db.prepare('INSERT INTO cases (message_id) VALUES (?)').run(message.id);
                    });
                });
            });
        } else {
            msg.channel.send('No user provided');
        }
        } catch (err) {
            msg.channel.send(err)
        }
    }
};
