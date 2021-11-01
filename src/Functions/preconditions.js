function preconditions(client, msg, command) {
    if (command.ownerOnly && !msg.member.roles.cache.some(role => role.id === client.settings.modrole)) {
        return true;
    }

    if (command.permissions !== undefined && Array.isArray(command.permissions) && msg.guild) { // Permissions stuff
        const doesntHave = command.permissions.some(x => !msg.member.permissions.has(x));
        if (doesntHave) {
            const missing = command.permissions.filter(x => !msg.member.permissions.has(x));
            return msg.channel.send(`You're missing the following permissions: ${missing.join(', ')}`);
        }
    }
}

module.exports = {
    preconditions
} 