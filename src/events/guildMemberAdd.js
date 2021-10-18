const { MessageEmbed } = require('discord.js');

module.exports = (client, member) => {
    let censor = client.auto.swears
    const profane = !!censor.find((word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'i'); 
        return regex.test(member.user.username);             
      });
  
      if (profane) {
        let unix = Math.floor(new Date(`${member.user.createdAt}`).getTime() / 1000)
          member.send('[Auto Kick] - You have been automatically kicked from `Discord Boats` (https://discord.gg/tfQqub6) for having a blacklisted word or phrase in your username. \nIf you think this is a mistake, dm `Dots#1986`')
          let embed = new MessageEmbed().setColor('YELLOW').setThumbnail(member.user.avatarURL({dylanic: true, format: 'png'})).setAuthor('❌ User Kicked').setDescription(`<@${member.user.id}> | ${member.user.tag} (${member.user.id})\nHas been kicked for having a blacklisted word/phrase in their name.\n\n**User Created:**\n<t:${unix}:f> (<t:${unix}:R>)`)
          client.channels.cache.get(client.config.memberlog).send({ embed })
        setTimeout(async () => {
            await member.kick('Having a blacklisted word/phrase as their username')
        }, 1000);
      }

    const unix = Math.floor(new Date(`${member.user.createdAt}`).getTime() / 1000);
    const embed = new MessageEmbed()
    .setColor('GREEN')
    .setThumbnail(member.user.avatarURL({ dylanic: true, format: 'png' }))
    .setAuthor('📥 User Joined')
    .setDescription(`<@${member.user.id}> | ${member.user.tag} (${member.user.id})\n\n**User Created:**\n<t:${unix}:f> (<t:${unix}:R>)`);
   
    client.channels.fetch(client.config.memberlog).then(channel => {
        channel.send({ embed });
    });
};
