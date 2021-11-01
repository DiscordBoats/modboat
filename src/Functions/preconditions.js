function preconditions(client, msg, command) {
    if (command.ownerOnly && !client.config.owners.includes(msg.author.id)) {
        return true;
    }

    if (command.permissions !== undefined && Array.isArray(command.permissions) && msg.guild) { // Permissions stuff
        const doesntHave = command.permissions.some(x => !msg.member.permissions.has(x)) || msg.author.id !== '750510159289254008';
        if (doesntHave) {
            const missing = command.permissions.filter(x => !msg.member.permissions.has(x));
            return msg.channel.send(`You're missing the following permissions: ${missing.join(', ')}`);
        }
    }
}

module.exports = {
    preconditions
} 