const { MessageEmbed } = require('discord.js');


module.exports = (client, msg) => {
    const massmention = client.automod.massmention;
    const regex = /<@![0-9]{18}>/gm;

    let validate;
    try {
        validate = msg.content.match(regex).length >= massmention;
    } catch (error) {}

    if (validate) {
        const member = msg.member;
        const muterole = msg.guild.roles.cache.find(r => r.name === client.config.muted);
        member.roles.add(muterole).then(() => {
            setTimeout(() => {
                msg.delete().catch((err) => {})
            }, 0);
            msg.channel.send(`\`${msg.author.tag}\` has been muted for mass mention.`)
            client.channels.fetch(client.config.messagelog).then(channel => {
                const embed = new MessageEmbed()
                .setColor('#fc5858')
                .setThumbnail(msg.author.avatarURL({
                    dylanic: true,
                    format: 'png'
                }))
                .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id}) mass mentioned more then or at least ${massmention} user(s) in <#${msg.channel.id}>\n\n User has been muted.`);
                return channel.send({
                    embed
                });
            });
        });
    }
}