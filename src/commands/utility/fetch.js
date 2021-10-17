module.exports = {
    name: 'fetch',
    description: 'Find users whose username contains some characters.',
    usage: '[search]',
    category: 'Utility',
    permissions: ['BAN_MEMBERS'],
    execute(client, msg, args) {
        const users = client.users.cache.filter(user => user.username.includes(args[0]));
        const embed = {
            color: 'd35c5e',
            title: 'Results found',
            description: users.map(user => `${user.tag} (${user.id})`).join('\n')
        }
        msg.channel.send({ embed });
    }
};
