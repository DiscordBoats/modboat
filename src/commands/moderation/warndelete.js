module.exports = {
    name: 'warndelete',
    description: 'Removes a warning from a user.',
    usage: '[user mention or id] [amount]',
    category: 'Moderation',
    permissions: ['KICK_MEMBERS'],
    execute(client, msg, args) {
        const user = msg.mentions.users.first() ? msg.mentions.users.first().id : args[0];
        const member = msg.guild.member(user);
        if (member) {
            if (!member.kickable) {
                return msg.channel.send('You cannot remove warnings from this user.');
            }
    
            if (member.id === msg.author.id || member.id === client.user.id) {
                return msg.channel.send('You cannot remove warnings from the bot or yourself.');
            }
    
            if (client.settings.modrole) {
                if (member.roles.cache.find(r => r.id === client.settings.modrole)) {
                    return msg.channel.send('You cannot remove warnings from this user.');
                }
            }

            const currentWarnings = client.db.prepare('SELECT number FROM warns WHERE id = ?').get(member.id);
            if (!currentWarnings || currentWarnings.number === 0) { 
                return msg.channel.send('This user has no warnings.');
            }

            let number = args[1] ? parseInt(args[1]) : 1;
            if (isNaN(number)) { 
                number = currentWarnings;
            } else if (number > currentWarnings.number) {
                number = currentWarnings.number;
            } else if (number < 1) {
                number = 1;
            }

            client.db.prepare('INSERT OR REPLACE INTO warns (id, number) VALUES (?, ?)').run(member.id, currentWarnings.number - number);
    
            client.channels.fetch(client.config.modlog).then(channel => {
                const latest = client.db.prepare('SELECT number FROM cases ORDER BY number DESC LIMIT 1').get() || { number: 0 };
                const embed = {
                    color: '040d14',
                    author: {
                        name: 'Remove Warning | Case #' + (latest.number + 1),
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
        } else {
            msg.channel.send('No user provided');
        }
    }
};
