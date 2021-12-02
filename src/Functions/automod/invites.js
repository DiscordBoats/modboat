const {MessageEmbed, Permissions} = require('discord.js');

module.exports = async (client, msg) => {
    if (!client.settings.modrole || !client.settings.mutedrole || !client.settings.messagelog) {
        return;
    }

    const censor = client.automod.invites || [];
    const censorChecks = !!censor.find((word) => {
        if (msg.member.roles.cache.has(client.settings.modrole)) {
            return;
        }
        if (msg.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || msg.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || msg.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return;
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(msg.content);
    });

    if (censorChecks) {
        const expression = /(https?:\/\/[^\s]+)/gi; const regex = new RegExp(expression); // Shit to get the invite link

        try {
            setTimeout(async () => {
                await client.fetchInvite(msg.content.match(regex)).then(async inv => {
                    msg.channel.send(`Lmao, looks like <@${msg.author.id}> sent a discord invite to ||\`${inv.guild.name}\`||- User Muted.`);
                    await msg.delete({reason: 'Sent a invite link'})
                    await msg.member.roles.add(client.settings.mutedrole);
                })

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