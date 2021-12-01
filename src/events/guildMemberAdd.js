const {MessageEmbed} = require('discord.js');
const moment = require("moment");

module.exports = (client, member) => {
    const unix = Math.floor(new Date(`${member.user.createdAt}`).getTime() / 1000);

    let day = Number('30');
    let x = Date.now() - member.user.createdAt;
    let created = Math.floor(x / 86400000);

    if (day >= created) {
        member.send(`You have been kicked from \`${member.guild.name}\` for having a young account. You can join back once your account is older than 30 days. ( https://discord.gg/tfQqub6 )`).then(() => {
            member.kick('Account created less than 30 days ago.').then(r => {
                client.channels.fetch(client.settings.memberlog).then(channel => {
                    channel.send(new MessageEmbed()
                        .setColor('YELLOW')
                        .setThumbnail(member.user.avatarURL({dynamic: true, format: 'png'}))
                        .setDescription(`🔰 <@${member.user.id}> | ${member.user.tag} (${member.user.id}) has been automatically **kicked** - Their account is too young.\n\n**User Created:**\n<t:${unix}:f> (<t:${unix}:R>)`)
                    );
                })
            });
        });



    }

    /*
    let censor = client.automod.swears || [];
    const profane = !!censor.find((word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'i'); 
        return regex.test(member.user.username);             
    });


    if (profane) {
      member.send('[Auto Kick] - You have been automatically kicked from `Discord Boats` (https://discord.gg/tfQqub6) for having a blacklisted word or phrase in your username. \nIf you think this is a mistake, dm `Dots#1986`');

      const embed = new MessageEmbed()
      .setColor('YELLOW')
      .setThumbnail(member.user.avatarURL({ dynamic: true, format: 'png' }))
      .setAuthor('❌ User Kicked')
      .setDescription(`<@${member.user.id}> | ${member.user.tag} (${member.user.id})\nHas been kicked for having a blacklisted word/phrase in their name.\n\n**User Created:**\n<t:${unix}:f> (<t:${unix}:R>)`);
      client.channels.cache.get(client.config.memberlog).send({ embed });

      setTimeout(async () => {
        await member.kick('Having a blacklisted word/phrase as their username')
      }, 1000);
    }
*/
    if (!client.settings.memberlog) {
        return;
    }

    const embed = new MessageEmbed()
        .setColor('GREEN')
        .setThumbnail(member.user.avatarURL({dynamic: true, format: 'png'}))
        .setAuthor('📥 User Joined')
        .setDescription(`<@${member.user.id}> | ${member.user.tag} (${member.user.id})\n\n**User Created:**\n<t:${unix}:f> (<t:${unix}:R>)`);

    client.channels.fetch(client.settings.memberlog).then(channel => {
        channel.send({embed});
    });
};
