const { MessageEmbed } = require('discord.js');

module.exports = (client, msg) => {
    if (!client.settings.modrole || !client.settings.mutedrole || !client.settings.messagelog) {
        return;
    }

    const massmention = client.automod.massmention || [];
    const regex = /<@![0-9]{18}>/gm;

    let validate;
    try {
        validate = msg.content.match(regex).length >= massmention;
    } catch (error) {}

    if (validate) {
        const member = msg.member;
        member.roles.add(client.settings.mutedrole).then(() => {
            setTimeout(() => {
                msg.delete().catch((err) => {})
            }, 0);
            msg.channel.send(`\`${msg.author.tag}\` has been muted for mass mentions.`);
            client.channels.fetch(client.settings.messagelog).then(channel => {
                const embed = new MessageEmbed()
                .setColor('#fc5858')
                .setThumbnail(msg.author.avatarURL({
                    dylanic: true
                }))
                .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id}) mass mentioned more then or at least ${massmention} user(s) in <#${msg.channel.id}>\n\n User has been muted.`);
                return channel.send({
                    embed
                });
            });
        });
    }
}