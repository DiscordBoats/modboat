const fetch = require('node-fetch');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = async (client, msg) => {
    const unix = Math.floor(new Date().getTime() / 1000);
    const scam = await fetch(client.automod.scamLinks).then(res => res.json()); 

    const scamRegex = !!scam.find((word) => {
        if (msg.member.roles.cache.find(r => r.id === client.config.modRole) || msg.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return;
        }
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(msg.content);
    });

    if (scamRegex) {
        setTimeout(() => {
            msg.delete()
        }, 0);

        const muterole = msg.guild.roles.cache.find(r => r.name === client.config.muted);
        msg.member.roles.add(muterole);
        const embed = new MessageEmbed()
        .setAuthor('❌ Phishing Link Detected')
        .setColor('RED')
        .setThumbnail(msg.author.avatarURL({ dynamic: true }))
        .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id})\nhas been perm muted.\n\nMessage Deleted <t:${unix}:R>: ||${msg.content}||`)
        .setFooter('Clicking on the link can expose your IP (location) and entering in any information details like your password or email address, will compromise your account(s).');
        msg.channel.send(`${msg.author.id}`, embed);
    }
}