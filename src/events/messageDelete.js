module.exports = (client, oldMsg) => {
    if (!oldMsg.author.bot === false) {
        return;
    }

    client.channels.fetch(client.config.messagelog).then(channel => {
        const embed = {
            color: 'dc3b3b',
            author: {
                name: `A message was deleted by ${oldMsg.author.tag} (${oldMsg.author.id})`,
                icon_url: oldMsg.author.avatarURL()
            },
            title: `<#${oldMsg.channel.id}>`,
            description: `**Message**:\n${oldMsg.content} ${oldMsg.attachments.size > 0 ? '[Attachment]' : ''}`
        }
        channel.send({ embed });
    });

    // snipe
    client.snipes.set(oldMsg.channel.id, {
        content: oldMsg.content,
        author: `${oldMsg.author.tag} (${oldMsg.author.id})`,
        icon: oldMsg.author.avatarURL(),
        timestamp: oldMsg.createdAt
    });
};
