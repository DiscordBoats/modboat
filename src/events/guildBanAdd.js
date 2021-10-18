module.exports = async (client, guild, member) => {
    const logs = await guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_BAN' });
    const log = logs.entries.first();
    if (!log) {
        return;
    }
    
    if (log.executor && log.target.id === member.id) {
        client.channels.fetch(client.config.modlog).then(channel => {
            const latest = client.db.prepare('SELECT number FROM cases ORDER BY number DESC LIMIT 1').get() || { number: 0 };
            const embed = {
                color: 'dc3b3b',
                author: {
                    name: 'Ban | Case #' + (latest.number + 1),
                    icon_url: log.executor.avatarURL()
                },
                description: `**User:** ${log.target.tag} (${log.target.id})\n**Moderator:** ${log.executor.tag} (${log.executor.id})\n**Reason:** ${log.reason || 'No reason provided'}`,
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
};
