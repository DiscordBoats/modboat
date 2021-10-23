module.exports = {
    name: 'unmute',
    description: 'Unmutes a user.',
    usage: '[user mention or id] [reason]',
    category: 'Moderation',
    permissions: ['MANAGE_ROLES'],
    execute(client, msg, args) {
        if (!client.settings.mutedrole) { 
            return msg.channel.send(`The muted role has not been set up yet.`);
        }

        const user = msg.mentions.users.first() || args[0];
        const member = msg.guild.member(user);
        if (member) {
            if (user.id === msg.author.id || user.id === client.user.id) {
                return msg.channel.send('You cannot unmute the bot or yourself.');
            }

            if (client.settings.modrole) {
                if (member.roles.cache.find(r => r.id === client.settings.modrole)) {
                    return msg.channel.send('You cannot unmute this user.');
                }
            }

            if (!member.roles.cache.has(client.settings.mutedrole)) {
                return msg.channel.send('This user is not muted.');
            }

            member.roles.remove(client.settings.mutedrole).then(() => {
                msg.channel.send(`${user.tag} (${user.id}) has been unmuted.`);
                client.db.prepare('DELETE FROM mutes WHERE id = ?').run(user.id);
                if (!client.settings.modlog) {
                    return;
                }

                client.channels.fetch(client.settings.modlog).then(channel => {
                    const latest = client.db.prepare('SELECT number FROM cases ORDER BY number DESC LIMIT 1').get() || { number: 0 };
                    const embed = {
                        color: '040d14',
                        author: {
                            name: 'Unmute | Case #' + (latest.number + 1),
                            icon_url: msg.author.avatarURL()
                        },
                        description: `**User:** ${user.tag} (${user.id})\n**Moderator:** ${msg.author.tag} (${msg.author.id})\n**Reason:** ${args.slice(1).join(' ') || 'No reason provided. To provide a reason run +reason ' + (latest.number + 1)}`,
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
                msg.channel.send('Failed to unmute user.');
            });
        } else {
            msg.channel.send('No user provided');
        }
    }
};
