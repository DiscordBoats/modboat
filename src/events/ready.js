module.exports = (client) => {
    console.log('Started');
    client.user.setActivity('members', { type: 'WATCHING' });
};
