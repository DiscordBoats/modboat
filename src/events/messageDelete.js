module.exports = (client, oldMsg) => {
    client.channels.fetch(client.config.messagelog).then(channel => {
        const embed = {
            color: 'dc3b3b',
            author: {
                name: `A message was deleted by ${oldMsg.author.tag} (${oldMsg.author.id})`,
                icon_url: oldMsg.author.avatarURL()
            },
            title: '#' + oldMsg.channel.name,
            description: `**Message**:\n${oldMsg.content} ${oldMsg.attachments.size > 0 ? '[Attachment]' : ''}`
        }
        channel.send({ embed });
    });
};
