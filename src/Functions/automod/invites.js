const {MessageEmbed} = require('discord.js');

module.exports = async (client, msg) => {
    if (!client.settings.modrole || !client.settings.mutedrole || !client.settings.messagelog) {
        return;
    }

    const censor = client.automod.invites || [];
    const censorChecks = !!censor.find((word) => {
        if (msg.member.roles.cache.has(client.settings.modrole)) {
            return;
        }
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(msg.content);
    });

    if (censorChecks) {
        try {
            setTimeout(async () => {
                msg.channel.send(`Lmao, looks like <@${msg.author.id}> sent a discord invite link to .`);
                await msg.delete({reason: 'Sent a invite link'})
            }, 1000);
            client.channels.fetch(client.settings.messagelog).then(channel => {
                const embed = new MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(msg.author.avatarURL({dynamic: true}))
                    .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id}) tried to advertise in <#${msg.channel.id}>\n\n Message Deleted: ||${msg.content}||\n\n** **`);
                return channel.send({
                    embed
                });
            });
        } catch(err) {
            console.error(err);
        }

    }
} 