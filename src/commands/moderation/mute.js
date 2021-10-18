module.exports = {
    name: 'mute',
    description: 'Mutes a user.',
    usage: '[user mention or id] [reason] | [time]',
    category: 'Moderation',
    permissions: ['MANAGE_ROLES'],
    execute(client, msg, args) {
        const user = msg.mentions.users.first() || args[0];
        const member = msg.guild.member(user);
        if (member) {
            if (user.id === msg.author.id || user.id === client.user.id) {
                return msg.channel.send('You cannot mute the bot or yourself.');
            }

            if (member.roles.cache.find(r => r.id === client.config.modRole)) {
                return msg.channel.send('You cannot mute this user.');
            }

            const muterole = msg.guild.roles.cache.find(r => r.name === 'Muted');
            if (member.roles.cache.has(muterole.id)) {
                return msg.channel.send('This user is already muted.');
            }

            member.roles.add(muterole.id).then(() => {
                msg.channel.send(`${user} has been muted.`);
                client.channels.fetch(client.config.modlog).then(channel => {
                    const latest = client.db.prepare('SELECT number FROM cases ORDER BY number DESC LIMIT 1').get() || { number: 0 };
                    const embed = {
                        color: '2e6cc2',
                        author: {
                            name: 'Mute | Case #' + (latest.number + 1),
                            icon_url: msg.author.avatarURL()
                        },
                        description: `**User:** ${user.tag}\n**Moderator:** ${msg.author.tag}\n**Reason:** ${args.slice(1).join(' ') || 'No reason provided. To provide a reason run +reason ' + (latest.number + 1)}`,
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
            }).catch(err => {
                console.error(err);
                msg.channel.send('Failed to mute user.');
            });
        } else {
            msg.channel.send('No user provided');
        }
    }
};
