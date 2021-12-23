module.exports = {
    name: 'tag',
    description: 'Use a tag',
    usage: '[name]',
    category: 'Utility',
    permissions: ['BAN_MEMBERS'],
    async execute(client, msg, args) {
        const tag = client.db.prepare('SELECT * FROM tags WHERE name=?').get(args[0]);
        if (!tag) {
            return msg.channel.send('Tag doesn\'t exist.');
        }

        const embed = {
            color: '8291ca',
            title: tag.title,
            description: tag.description,
            footer: {
                text: msg.author.tag,
                icon_url: msg.author.avatarURL()
            }
        }

        if (tag.image !== 'null') {
            embed.image = {
                url: tag.image
            };
        }
        await msg.channel.send({embeds: [embed]});
    }
}; 
