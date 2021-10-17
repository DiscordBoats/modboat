module.exports = (client, member) => {
    client.channels.fetch(client.config.memberlog).then(channel => {
        channel.send(`:inbox_tray: **${member.user.tag}** (${member.user.id}) has joined.`);
    });
};
