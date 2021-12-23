module.exports = {
    name: 'snipe',
    description: 'Get the most recent deleted message.',
    usage: '',
    category: 'Utility',
    permissions: ['BAN_MEMBERS'],
    async execute(client, msg, _args) {
        const snipe = client.snipes.get(msg.channel.id);
        if (!snipe) {
            return msg.channel.send('There are no deleted messages in this channel.');
        }

        const embed = {
            color: 0x0099ff,
            author: {
                name: snipe.author,
                icon_url: snipe.icon,
            },
            title: 'Snipe',
            description: snipe.content,
            timestamp: snipe.timestamp,
            image: snipe.image
        }

        await msg.channel.send({embeds: [embed]});
    }
};
