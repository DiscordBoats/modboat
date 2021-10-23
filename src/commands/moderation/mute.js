const ms = require('ms');

module.exports = {
    name: 'mute',
    description: 'Mutes a user.',
    usage: '[user mention or id] [reason] | [time]',
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
                return msg.channel.send('You cannot mute the bot or yourself.');
            }

            if (client.settings.modrole) {
                if (member.roles.cache.find(r => r.id === client.settings.modrole)) {
                    return msg.channel.send('You cannot mute this user.');
                }
            }

            if (member.roles.cache.has(client.settings.mutedrole)) {
                return msg.channel.send('This user is already muted.');
            }

            member.roles.add(client.settings.mutedrole).then(() => {
                msg.channel.send(`${user.tag} (${user.id}) has been muted.`);
                const time = args.slice(1).join(' ').split('| ');
                if (time[1]) {
                    client.db.prepare('INSERT INTO mutes (id, expires) VALUES (?, ?)').run(member.id, Date.now() + ms(time[1]));
                }

                if (!client.settings.modlog) {
                    return;
                }

                client.channels.fetch(client.settings.modlog).then(channel => {
                    const latest = client.db.prepare('SELECT number FROM cases ORDER BY number DESC LIMIT 1').get() || { number: 0 };
                    const embed = {
                        color: '2e6cc2',
                        author: {
                            name: 'Mute | Case #' + (latest.number + 1),
                            icon_url: msg.author.avatarURL()
                        },
                        description: `**User:** ${user.tag}\n**Moderator:** ${msg.author.tag}\n**Reason:** ${time[0] || 'No reason provided. To provide a reason run +reason ' + (latest.number + 1)}${time[1] ? `\n**Time:** ${ms(ms(time[1]), { long: true })}` : ''} `,
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
