const {MessageEmbed} = require('discord.js');

module.exports = async (client, message) => {
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

    client.log.info("Mass mention function is running")

    if (!client.settings.modrole || !client.settings.mutedrole || !client.settings.messagelog) return;
    //  if (message.member.permission.has("MANAGE_MESSAGES")) return;

    // write a regex to match all mentions
    const member = await message.guild.members.fetch(message.author.id);
    const regex = /<@![0-9]{18}>/gm;
    if (regex.test(message.content)) {
        if (message.content.match(regex)?.length < client.automod.massmention) {
            client.log.warn("Mass mention is not being triggered due to not enough mentions.")
            return;
        }
        client.log.warn(`${message.author.tag} triggered the mass mention`);
        await member.roles.add(client.settings.mutedrole).catch(e => {
        });
        setTimeout(() => message.delete(), 0)
        await message.channel.send({content: `**${message.author.tag}** has been muted for mass mentions.`});
        const logs = await client.channels.fetch(client.settings.messagelog, true, true).then((channel) => {
            if (!channel) {
                return;
            }
            let embed = new MessageEmbed()
                .setColor("#fc5858")
                .setThumbnail(message.author.avatarURL({dynamic: true}))
                .setDescription(`${message.author} | ${message.author.tag} (${message.author.id}) mass mention detected. User muted.`)
                .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}), `https://discord.com/channels/${message.guild.id}/${message.channel.id}`)
            channel.send({embed}).catch(() => null);
        })
    } else {
        client.log.warn("Mass mention not firing due to regex fail")
    }

}