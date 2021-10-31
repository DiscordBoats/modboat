module.exports = {
    name: 'tags',
    description: 'Get a list of tags',
    usage: '',
    category: 'Utility',
    permissions: ['BAN_MEMBERS'],
    async execute(client, msg, args) {
        const tags = client.db.prepare('SELECT name FROM tags').all();
        if (tags.length === 0) {
            return msg.channel.send('There are no tags.');
        }

        const embed = {
            color: 0x0099ff,
            title: 'Tags',
            description: tags.map(x => `\`${x.name}\``).join(', ')
        }

        await msg.channel.send({embed});
    }
};
