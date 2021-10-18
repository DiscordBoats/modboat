module.exports = {
    name: 'tagdelete',
    description: 'Delete a tag',
    usage: '[name]',
    category: 'Utility',
    permissions: ['BAN_MEMBERS'],
    async execute(client, msg, args) {
        if (!args[0]) {
            msg.channel.send('Please provide a tag name.');
        }

        const exists = client.db.prepare('SELECT EXISTS (SELECT 1 FROM tags WHERE name = ?);').get(args[0]);
        if (exists['EXISTS (SELECT 1 FROM tags WHERE name = ?)'] === 0) {
            return msg.channel.send('Tag doesn\'t exist.');
        }

        client.db.prepare('DELETE FROM tags WHERE name =?').run(args[0]);
        msg.channel.send(`Tag \`${args[0]}\` deleted.`);
    }
};
