module.exports = {
    name: 'tagcreate',
    description: 'Create a tag',
    usage: '[name] | [title] | [description] | [image]',
    category: 'Utility',
    permissions: ['BAN_MEMBERS'],
    async execute(client, msg, args) {
        const tag = args.slice(1).join(' ').split(' | ');
        if (tag[2]) {
            if (!tag[2].startsWith('http')) {
                return msg.channel.send('Image must be a link');
            }
        }

        client.db.prepare('INSERT INTO tags (name, title, description, image) VALUES (?, ?, ?, ?)').run(args[0].toLowerCase(), tag[0], tag[1], tag[2] || null);
        msg.channel.send(`Tag \`${args[0].toLowerCase()}\` created!`);
    }
};
