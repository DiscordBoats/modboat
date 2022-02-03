module.exports = {
    name: 'timeout',
    description: 'Timeout users.',
    usage: '[user]',
    category: 'Moderation',
    permissions: ['MANAGE_GUILD'],
    async execute(_client, msg, args) {
        if (_client.settings.modrole) {
            const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
            if (member.roles.cache.has(_client.settings.modrole)) {
                return msg.channel.send('You cannot timeout this user.');
            }

            if (member.id === msg.author.id || member.id === _client.user.id) {
                return msg.channel.send('You cannot timeout the bot or yourself.');
            }
            await _client.time.timeOut(_client, msg.guild.id, member.id);
            _client.channels.fetch(_client.settings.modlog).then(channel => {
                const latest = _client.db.prepare('SELECT number FROM cases ORDER BY number DESC LIMIT 1').get() || {number: 0};
                const embed = {
                    color: 'f1aeae',
                    author: {
                        name: 'Timeout | Case #' + (latest.number + 1),
                        icon_url: msg.author.avatarURL()
                    },
                    description: `**User:** ${member.user.tag} (${member.user.id})\n**Moderator:** ${msg.author.tag} (${msg.author.id})\n**Reason:** ${args.slice(1).join(' ') || `No reason provided. To provide a reason run \`+reason ${(latest.number + 1)}\``}`,
                    footer: {
                        text: msg.guild.name,
                        icon_url: msg.guild.iconURL()
                    }
                }
                channel.send({
                    embeds: [embed]
                }).then(message => {
                    _client.db.prepare('INSERT INTO cases (message_id) VALUES (?)').run(message.id);
                });
            });
            return msg.channel.send(`${member.user.tag} (${member.id}) has been timed out.`)
        } else {
            msg.channel.send('No user provided');
        }
    }
}