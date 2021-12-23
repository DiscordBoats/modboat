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
            _client.time.timeOut(_client, msg.guild.id, member.id)
            return msg.channel.send(`${member.user.tag} (${member.id}) has been timed out.`)
        } else {
            msg.channel.send('No user provided');
        }
    }
}