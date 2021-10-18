const { MessageEmbed } = require('discord.js');

module.exports = (client, member) => {
    const unix = Math.floor(new Date(`${member.user.createdAt}`).getTime() / 1000);
    const embed = new MessageEmbed()
    .setColor('RED')
    .setThumbnail(member.user.avatarURL({ dylanic: true, format: 'png' }))
    .setAuthor('📤 User Left')
    .setDescription(`<@${member.user.id}> | ${member.user.tag} (${member.user.id})\n\n**User Created:**\n<t:${unix}:f> (<t:${unix}:R>)`);
   
    client.channels.fetch(client.config.memberlog).then(channel => {
        channel.send({ embed });
    });
};
