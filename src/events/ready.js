module.exports = (client) => {
    client.log.info('Connected to Discord');
    client.user.setActivity('members', { type: 'WATCHING' });
};
