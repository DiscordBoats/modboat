
module.exports = (client, oldMsg) => {
    if (!oldMsg.author.bot === false) {
        return;
    }

    client.channels.fetch(client.config.messagelog).then(channel => {
const embed = new MessageEmbed().setColor('#dc3b3b').setDescription(`<@${oldMsg.author.id}> | ${oldMsg.author.tag} (${oldMsg.author.id})\ndeleted a message in <#${oldMsg.channel.id}>\n`).addField('Deleted Message:', `\`${oldMsg.content}\` ${oldMsg.attachments.size > 0 ? '[Attachment]' : ''}`).setThumbnail(oldMsg.author.avatarURL({dynamic: true}))
/*
        const embed = {
            color: 'dc3b3b',
            author: {
                name: `A message was deleted by ${oldMsg.author.tag} (${oldMsg.author.id})`,
                icon_url: oldMsg.author.avatarURL()
            },
            title: `#${oldMsg.channel.name}`,
            description: `**Message**:\n${oldMsg.content} ${oldMsg.attachments.size > 0 ? '[Attachment]' : ''}`
        }
        */
        channel.send(embed);
    });

    // snipe
    client.snipes.set(oldMsg.channel.id, {
        content: oldMsg.content,
        author: `${oldMsg.author.tag} (${oldMsg.author.id})`,
        icon: oldMsg.author.avatarURL(),
        timestamp: oldMsg.createdAt
    });
};
