const { MessageEmbed } = require('discord.js');

module.exports = (client, oldMsg) => {
    if (oldMsg.author.bot === true) {
        return;
    }
    
    // snipe
    client.snipes.set(oldMsg.channel.id, {
        content: oldMsg.content,
        author: `${oldMsg.author.tag} (${oldMsg.author.id})`,
        icon: oldMsg.author.avatarURL(),
        image: oldMsg.attachments.first() ? oldMsg.attachments.first().proxyURL : null,
        timestamp: oldMsg.createdAt
    });

    if (!client.settings.messagelog) {
        return;
    }

    client.channels.fetch(client.settings.messagelog).then(channel => {
        const embed = new MessageEmbed()
        .setColor('#dc3b3b')
        .setDescription(`<@${oldMsg.author.id}> | ${oldMsg.author.tag} (${oldMsg.author.id})\ndeleted a message in <#${oldMsg.channel.id}>\n`).addField('Deleted Message:', `${oldMsg.content ? oldMsg.content : `[No messages found](${oldMsg.attachments.first() ? oldMsg.attachments.first().proxyURL : null}).`}`).setImage(oldMsg.attachments.first() ? oldMsg.attachments.first().proxyURL : null)
        .setThumbnail(oldMsg.author.avatarURL({ dynamic: true }));
        return channel.send(embed);
    });
};