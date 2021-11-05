module.exports = {
    name: 'tagedit',
    description: 'Edit a tag',
    usage: '[name] [new content]',
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

        const tag = args.slice(1).join(' ').split(' | ');
        if (tag[2]) {
            if (!tag[2].startsWith('http')) {
                return msg.channel.send('Image must be a link');
            }
        }

        client.db.prepare(`UPDATE tags SET title = ?, description = ?, image = ? WHERE name = ?`).run(tag[0], tag[1], tag[2] || null, args[0]);
        msg.channel.send(`Tag \`${args[0]}\` has been edited.`);
    }
};
