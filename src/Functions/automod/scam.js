const {MessageEmbed, Permissions, MessageActionRow, MessageButton} = require('discord.js');

module.exports = async (client, msg) => {
    const unix = Math.floor(new Date().getTime() / 1000);

    let data = await require('node-fetch')(client.automod.scamLinks, {
        method: "post",
        body: JSON.stringify({message: msg.content}),
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "Anti-phishing (Nek#2937 / 750510159289254008)",
        },

    }).then(res => res.json())
    /*
    const scam = await fetch(client.automod.scamLinks).then(res => res.json()); 

    const scamRegex = !!scam.find((word) => {
        if (msg.member.roles.cache.has(client.settings.modrole)) {
            return;
        }
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(msg.content);
    });
*/
    if (data.match) {
        if (msg.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || msg.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || msg.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return;
        await msg.member.timeout(10000 * 60 * 1000, 'Detected a phishing link from the user.');
        setTimeout(() => {
            msg.delete()
        }, 0);

        const remRow = new MessageActionRow()
            .addComponents(new MessageButton()
                .setCustomId('unban')
                .setLabel('Unban User')
                .setStyle('SUCCESS'),
            )
            .addComponents(new MessageButton()
                .setCustomId('addTimeout')
                .setLabel('Add Timeout')
                .setStyle('PRIMARY'),

            )
        const addRow = new MessageActionRow()
            .addComponents(new MessageButton()
                .setCustomId('ban')
                .setLabel('Ban User')
                .setStyle('DANGER'),
            )
            .addComponents(new MessageButton()
                .setCustomId('removeTimeout')
                .setLabel('Remove Timeout')
                .setStyle('SUCCESS')
            )
        client.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;
            if(interaction.customId === 'unban') {
                const bans = await msg.guild.bans.fetch();
                const ban = bans.find(b => b.user.id === msg.author.id);
                if (!ban) {
                    return interaction.reply({content: 'User is not banned', ephemeral: true});
                }
                msg.guild.members.unban(msg.author.id, {
                    reason: `Unbanned by ${interaction.member.user.tag} (${interaction.member.user.id}) by the unban scam button`
                }).then(() => {
                    interaction.reply({content: 'User has been unbanned', ephemeral: true});
                })
                const remEmbed = interaction.message.embeds[0]
                remEmbed.addFields([{name: 'User unbanned by:', value: `${interaction.member.user.tag}`}])
                interaction.message.edit({content: `${interaction.message.content}`, embeds: [remEmbed], components: [addRow]})
                interaction.channel.send({content: 'User unbanned.'})

            }
            if(interaction.customId === 'removeTimeout') {
                if(!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({content: 'You do not have permission to remove timeouts.', ephemeral: true});

                const remEmbed = interaction.message.embeds[0]
                remEmbed.addFields([{name: 'User\'s timeout removed by:', value: `${interaction.member.user.tag}`}])
                await msg.member.disableCommunicationUntil(null, 'Moderator removed timeout.');
                interaction.message.edit({content: `${interaction.message.content}`, embeds: [remEmbed], components: [addRow]})
                interaction.reply({content: 'Timeout removed.', ephemeral: true})
                const addEmbed = interaction.message.embeds[0]
                addEmbed.addFields([{name: 'User\'s timeout removed by:', value: `${interaction.member.user.tag}`}])
                interaction.message.edit({content: `${interaction.message.content}`, embeds: [addEmbed], components: [remRow]})

            }
            if(interaction.customId === 'addTimeout') {
                if(!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({content: 'You do not have permission to add timeouts.', ephemeral: true});
                const addEmbed = interaction.message.embeds[0]
                addEmbed.addFields([{name: 'User timed out by:', value: `${interaction.member.user.tag}`}])
                await msg.member.timeout(10000 * 60 * 1000, 'Detected a phishing link from the user.');
                interaction.message.edit({content: `${interaction.message.content}`, embeds: [addEmbed], components: [remRow]})
                interaction.reply({content: 'Timeout added.', ephemeral: true})


            }
            if(interaction.customId === 'ban') {
                if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({content: `You don't have the permissions to ban`, ephemeral: true});
                await msg.member.disableCommunicationUntil(null, 'Removed timeout for ban');
                await msg.guild.members.ban(msg.author, {reason: `Banned by the anti phish button`})
                const latest = client.db.prepare('SELECT number FROM cases ORDER BY number DESC LIMIT 1').get() || {number: 0};
                const embed = {
                    color: 'dc3b3b',
                    author: {
                        name: 'Ban | Case #' + (latest.number + 1),
                        icon_url: interaction.user.avatarURL({dynamic: true})
                    },
                    description: `**User:** ${msg.author.tag} (${msg.author.id})\n**Moderator:** ${interaction.user.tag} (${interaction.user.id})\n**Reason:** [ Ban Button ] sending a malicious link `,
                    footer: {
                        text: msg.guild.name,
                        icon_url: msg.guild.iconURL()
                    }
                }
                client.channels.cache.get(client.settings.modlog).send({embeds: [embed]}).then(message => client.db.prepare('INSERT INTO cases (message_id) VALUES (?)').run(message.id))
                interaction.reply('Banned');
                const addEmbed = interaction.message.embeds[0]
                addEmbed.addFields([{name: 'User banned by:', value: `${interaction.member.user.tag}`}])
                interaction.message.edit({content: `${interaction.message.content}`, embeds: [addEmbed], components: [remRow]})
            }
        });


        let modlogembed = new MessageEmbed()
            .setColor('RED')
            .setAuthor('❌ Phishing Link Found')
            .setThumbnail(msg.author.avatarURL({dynamic: true}))
            .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id})\nhas been perm muted for sending a phishing link in ${msg.channel.name}.\n\nMessage Deleted <t:${unix}:R>: ||${msg.content}||`)
        client.channels.cache.get(client.settings.messagelog).send({embeds: [modlogembed], components: [addRow], content: `<@172797182565416962>`})

    }
}