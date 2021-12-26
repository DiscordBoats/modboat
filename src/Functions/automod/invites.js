const {MessageEmbed, Permissions, MessageActionRow, MessageButton} = require('discord.js');

module.exports = async (client, msg) => {
    const user = msg.guild.members.cache.get(msg.author.id);

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
        const balls = new MessageActionRow().addComponents(new MessageButton()
    .setCustomId('remTime')
    .setLabel('Remove Timeout')
    .setStyle('SUCCESS'),
)
            .addComponents(new MessageButton()
                .setCustomId('invite')
                .setLabel('Invite Info')
                .setStyle('SECONDARY'),
            )

        try {

            const url = new RegExp(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi)
            const invite = await client.fetchInvite(msg.content.match(url)[0])
            setTimeout(async () => {
                await user.timeout(10000 * 60 * 1000, 'Sent a invite link');
                    msg.channel.send({content: `Lmao, looks like <@${msg.author.id}> sent a invite - User Timed Out.`, components: [balls]});
                    await msg.delete({reason: 'Sent a invite link'})


            }, 1000);
            client.on('interactionCreate', async (interaction) => {
                if(interaction.customId === 'remTime') {
                    if(!interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return interaction.reply({content: 'You do not have permission to remove timeouts.', ephemeral: true});
                    await user.disableCommunicationUntil(null, 'Moderator removed timeout.');
                    return interaction.reply({content: 'Timeout removed.', ephemeral: true})

                }
                if(interaction.customId === 'invite') {
                    interaction.reply({content: `The invite leads to a server called \`${invite.guild.name}\` with a member count of \`${invite.guild.memberCount}\` *${invite.guild.memberCount < 30 ? 'What a lonely server': " "}*`, ephemeral: true})
                }
            })
            client.channels.fetch(client.settings.messagelog).then(channel => {
                const embed = new MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(msg.author.avatarURL({dynamic: true}))
                    .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id}) tried to advertise in <#${msg.channel.id}>\n\n Message Deleted: ||${msg.content}||\n\n** **`);
                return channel.send({
                    embeds: [embed]
                });
            });
        } catch(err) {
            console.error(err);
        }

    }
} 