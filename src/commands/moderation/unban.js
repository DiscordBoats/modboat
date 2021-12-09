module.exports = {
    name: 'unban',
    description: 'Unbans a user.',
    usage: '[user mention or id] [reason]',
    category: 'Moderation',
    permissions: ['BAN_MEMBERS'],
    async execute(client, msg, args) {
        const user = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || args[0]
        if (user) {
            const bans = await msg.guild.fetchBans();
            const ban = bans.find(b => b.user.id === user);
            if (!ban) {
                return msg.channel.send('User is not banned');
            }

            msg.guild.members.unban(user, {
                reason: `${args.slice(1).join(' ') ? args.slice(1).join(' ') : 'No reason provided'} [${msg.author.tag}}`
            }).then(() => {
                msg.channel.send(`${ban.user.tag} (${ban.user.id}) has been unbanned.`);
                if (!client.settings.modlog) {
                    msg.channel.send(`Looks like a mod log channel hasn't been set!`);
                }

                client.channels.fetch(client.settings.modlog).then(channel => {
                    const latest = client.db.prepare('SELECT number FROM cases ORDER BY number DESC LIMIT 1').get() || {number: 0};
                    const embed = {
                        color: '70bd92',
                        author: {
                            name: 'Unban | Case #' + (latest.number + 1),
                            icon_url: msg.author.avatarURL()
                        },
                        description: `**User:** ${ban.user.tag} (${ban.user.id})\n**Moderator:** ${msg.author.tag} (${msg.author.id})\n**Reason:** ${args.slice(1).join(' ') || `No reason provided. To provide a reason run \`+reason ${(latest.number + 1)}\``}`,
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
            }).catch(e => {
                console.log(e)
                msg.channel.send('Failed to unban user');
            });
        } else {
            msg.channel.send('No user provided');
        }
    }
};
