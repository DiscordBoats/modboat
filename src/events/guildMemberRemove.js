module.exports = (client, member) => {
    client.channels.fetch(client.config.memberlog).then(channel => {
        channel.send(`:outbox_tray: **${member.user.tag}** (${member.user.id}) has left.`);
    });
};
