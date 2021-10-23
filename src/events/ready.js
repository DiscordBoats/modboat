module.exports = async (client) => {
    client.log.info('Connected to Discord');
    await client.user.setActivity('members', { type: 'WATCHING' });

    // check for mutes
    setInterval(async () => {
        if (!client.settings.mutedrole) {
            return;
        }

        const mutes = client.db.prepare('SELECT * FROM mutes').all();
        for (const mute of mutes) {
            if (mute.expires < Date.now()) {
                const guild = client.guilds.cache.get('439866052684283905');
                let member = guild.members.cache.get(mute.id);
                if (!member) {
                    // cache members
                    await guild.members.fetch();
                    member = guild.members.cache.get(mute.id);
                }
                if (member) {
                    await member.roles.remove(client.settings.mutedrole);
                    client.db.prepare('DELETE FROM mutes WHERE id = ?').run(mute.id);

                    if (!client.settings.modlog) {
                        return;
                    }

                    client.channels.fetch(client.settings.modlog).then(channel => {
                        const latest = client.db.prepare('SELECT number FROM cases ORDER BY number DESC LIMIT 1').get() || { number: 0 };
                        const embed = {
                            color: '040d14',
                            author: {
                                name: 'Unmute | Case #' + (latest.number + 1),
                                icon_url: client.user.avatarURL()
                            },
                            description: `**User:** ${member.user.tag} (${member.id})\n**Moderator:** ${client.user.tag} (${client.user.id})\n**Reason:** Automatically unmuted.`,
                            footer: {
                                text: guild.name,
                                icon_url: guild.iconURL()
                            }
                        }
                        channel.send({
                            embed
                        }).then(message => {
                            client.db.prepare('INSERT INTO cases (message_id) VALUES (?)').run(message.id);
                        });
                    });
                }
            }
        }
    }, 5000);
};
