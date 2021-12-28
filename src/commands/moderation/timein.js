module.exports = {
    name: 'timein',
    description: 'Timein users.',
    usage: '[user]',
    category: 'Moderation',
    permissions: ['MANAGE_GUILD'],
    async execute(_client, msg, args) {
        if (_client.settings.modrole) {
            const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])
            if (member.roles.cache.has(_client.settings.modrole)) {
                return msg.channel.send('You cannot time in this user.');
            }

            if (member.id === msg.author.id || member.id === _client.user.id) {
                return msg.channel.send('You cannot time in the bot or yourself.');
            }
            await msg.member.disableCommunicationUntil(null, `[ ${msg.author.tag} ] - Timed in user.`);
            return msg.channel.send(`${member.user.tag} (${member.id}) has been timed in.`)
        } else {
            msg.channel.send('No user provided');
        }
    }
}