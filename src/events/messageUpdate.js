const { MessageEmbed } = require('discord.js');

module.exports = (client, oldMsg, newMsg) => {
    if (oldMsg.author.bot === true) {
        return;
    }

     client.channels.fetch(client.config.messagelog).then(channel => {
        const embed = new MessageEmbed()
        .setColor('YELLOW')
        .setDescription(`<@${oldMsg.author.id}> | ${oldMsg.author.tag} (${oldMsg.author.id})\na [message](https://discord.com/channels/${newMsg.guild.id}/${newMsg.channel.id}/${newMsg.id}) updated in <#${oldMsg.channel.id}>\n`).addField('Old Message:', `\`${oldMsg.content}\``)
        .addField("New Message:", `\`${newMsg.content}\``)
        .setThumbnail(oldMsg.author.avatarURL({ dynamic: true }));
        return channel.send(embed);
    });
};