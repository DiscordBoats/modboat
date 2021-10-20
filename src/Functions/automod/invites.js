const { Permissions, MessageEmbed } = require('discord.js');

module.exports = (client, msg) => {
    const censor = client.automod.invites;
    const censorChecks = !!censor.find((word) => {
        if (msg.member.roles.cache.find(r => r.id === client.config.modRole) || msg.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return;
        }
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(msg.content);
    });

    if (censorChecks) {
        setTimeout(() => {
            msg.delete().catch((err) => {})
        }, 0);
        client.channels.fetch(client.config.messagelog).then(channel => {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(msg.author.avatarURL({
                    dylanic: true
                }))
                .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id}) tried to advertise in <#${msg.channel.id}>\n\n Message Deleted: ||${msg.content}||\n\n** **`);
            return channel.send({
                embed
            });
        });
    }
} 