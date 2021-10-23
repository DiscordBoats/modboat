const { MessageEmbed } = require('discord.js');

module.exports = (client, member) => {
    if (!client.settings.memberlog) {
        return;
    }
    
    if(member.roles.cache.find(r => r.name === client.settings.mutedrole)) {
        client.channels.fetch(client.settings.modlog).then(channel => {
        const embed = {
            color: 'dc3b3b',
            author: {
                name: 'Auto Ban | Case #<unavailable>',
                icon_url: member.user.avatarURL({dynamic: true, size: 1024})
            },
            description: `**User:** ${member.user.tag} (${banned.user.id})\n**Moderator:** ${client.user.tag} (${client.user.id}\n**Reason:** [Auto Ban] Left the server while having the mute role.`,
        }

        // Useless timeout
        setTimeout(async () => {
            await member.ban({reason: '[Auto Ban] Leaving after being muted.'})
        }, 0);
        channel.send({ embed });
        });
    }

    const unix = Math.floor(new Date(`${member.user.createdAt}`).getTime() / 1000);
    const embed = new MessageEmbed()
    .setColor('RED')
    .setThumbnail(member.user.avatarURL({ dylanic: true, format: 'png' }))
    .setAuthor('📤 User Left')
    .setDescription(`<@${member.user.id}> | ${member.user.tag} (${member.user.id})\n\n**User Created:**\n<t:${unix}:f> (<t:${unix}:R>)\n**Roles**:${member.roles.cache.map(r => r).join(' | ')}`);
   
    client.channels.fetch(client.settings.memberlog).then(channel => {
        channel.send({ embed });
    });
};
