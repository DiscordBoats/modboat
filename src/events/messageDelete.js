const { MessageEmbed } = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = (client, oldMsg) => {
    if (!oldMsg.author.bot === false) {
        return;
    }

    client.channels.fetch(client.config.messagelog).then(channel => {
        const embed = new MessageEmbed()
        .setColor('#dc3b3b')
        .setDescription(`<@${oldMsg.author.id}> | ${oldMsg.author.tag} (${oldMsg.author.id})\ndeleted a message in <#${oldMsg.channel.id}>\n`).addField('Deleted Message:', `\`${oldMsg.content}\` ${oldMsg.attachments.size > 0 ? '[Attachment]' : ''}`)
        .setThumbnail(oldMsg.author.avatarURL({ dynamic: true }));
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
