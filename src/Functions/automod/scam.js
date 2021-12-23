const {MessageEmbed, Permissions, MessageActionRow, MessageButton} = require('discord.js');

module.exports = async (client, msg) => {
    const unix = Math.floor(new Date().getTime() / 1000);

    let data = await require('node-fetch')(`https://anti-fish.bitflow.dev/check`, {
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
        setTimeout(() => {
            !msg.deleted ? msg.delete() : null;
        }, 1000);
        const row = new MessageActionRow()
            .addComponents(new MessageButton()
                .setCustomId('ban')
                .setLabel('Ban User')
                .setStyle('DANGER'),
            )
        client.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;
            if(interaction.customId === 'ban') {
                const bans = await msg.guild.bans.fetch();
                const ban = bans.find(b => b.user.id === msg.author.id);
                if(ban) return interaction.reply({content: 'They are already banned', ephemeral: true});
                if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({content: `You don't have the permissions to ban`, ephemeral: true});
                await msg.guild.members.ban(msg.author, {reason: `Banned by the anti phish button`})
                const latest = client.db.prepare('SELECT number FROM cases ORDER BY number DESC LIMIT 1').get() || {number: 0};
                const embed = {
                    color: 'dc3b3b',
                    author: {
                        name: 'Ban | Case #' + (latest.number + 1),
                        icon_url: interaction.user.avatarURL({dynamic: true})
                    },
                    description: `**User:** ${msg.author.tag} (${msg.author.id})\n**Moderator:** ${interaction.user.tag} (${interaction.user.id})\n**Reason:** ${`No reason provided. To provide a reason run \`+reason ${latest.number + 1}\`  `} `,
                    footer: {
                        text: msg.guild.name,
                        icon_url: msg.guild.iconURL()
                    }
                }
                client.channels.cache.get(client.settings.modlog).send({embeds: [embed]}).then(message => client.db.prepare('INSERT INTO cases (message_id) VALUES (?)').run(message.id))
                interaction.reply('Banned');
            }
        });
        const embed = new MessageEmbed()
            .setAuthor(`❌ ${data.matches.map(m => m.type)} link detected!`)
            .setColor('RED')
            .setThumbnail(msg.author.avatarURL({dynamic: true}))
            .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id})\n\n\nScam link found <t:${unix}:R>:\n ||${data.matches.map(m => m.domain)}||`)
            .setFooter('Clicking on the link can expose your IP (location) and entering in any information details like your password or email address, will compromise your account(s).');
       // await msg.channel.send({content: msg.author.id, embeds: [embed], components: [row]});

            let modlogembed = new MessageEmbed()
                .setColor('RED')
                .setAuthor('❌ Phishing Link Found')
                .setThumbnail(msg.author.avatarURL({dynamic: true}))
                .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id})\nhas been perm muted for sending a phishing link in ${msg.channel.name}.\n\nMessage Deleted <t:${unix}:R>: ||${msg.content}||`)
            client.channels.cache.get(client.settings.messagelog).send({embeds: [modlogembed], components: [row], content: `<@172797182565416962>`});

    }
}