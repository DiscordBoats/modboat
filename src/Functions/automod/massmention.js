const { MessageEmbed } = require('discord.js');

module.exports = (client, message) => {
    //v1
    // if (!client.settings.modrole || !client.settings.mutedrole || !client.settings.messagelog) {
    //     return;
    // }

    // const massmention = client.automod.massmention;
    // const regex = /<@![0-9]{18}>/gm;

    // let validate;
    // try {
    //     validate = msg.content.match(regex).length >= massmention;
    // } catch (error) {}

    // if (validate) {
    //     const member = msg.member;
    //     member.roles.add(client.settings.mutedrole).then(() => {
    //         setTimeout(() => {
    //             msg.delete().catch((err) => {})
    //         }, 0);
    //         msg.channel.send(`\`${msg.author.tag}\` has been muted for mass mentions.`);
    //         client.channels.fetch(client.settings.messagelog).then(channel => {
    //             const embed = new MessageEmbed()
    //             .setColor('#fc5858')
    //             .setThumbnail(msg.author.avatarURL({
    //                 dynamic: true
    //             }))
    //             .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id}) mass mentioned more then or at least ${massmention} user(s) in <#${msg.channel.id}>\n\n User has been muted.`);
    //             return channel.send({
    //                 embed
    //             });
    //         });
    //     });
    // }

    //v2

    if (!client.settings.modrole || !client.settings.mutedrole || !client.settings.messagelog) return;
    //  if (message.member.permission.has("MANAGE_MESSAGES")) return;
    if (message.mentions.members) {
        if (message.mentions.members.size < client.automod.message.mention) return;
        member.roles.add(client.settings.mutedrole).catch(e => {});
        message.channel.send({ content: `**${message.author.tag}** has been muted for mass mentions.` });
        let logs = client.channels.get(client.settings.messagelog)
        if (!logs) return;
        let embed = new MessageEmbed()
            .setColor("#fc5858")
            .setThumbnail(message.author.avatarURL({ dynamic: true }))
            .setDescription(`${message.author} | ${message.author.tag} (${message.author.id}) mass mention detected. User muted.`)
            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }), `https://discord.com/channels/${message.guild.id}/${messgae.channel.id}`)
        logs.send({ embeds: [embed] }).catch(e => {});
    }

}