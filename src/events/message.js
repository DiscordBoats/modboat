module.exports = (client, msg) => {
    if (msg.author.bot || !msg.guild) {
        return;
    }

    // prefix stuff
    const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
    const prefix = msg.content.match(prefixMention) ? msg.content.match(prefixMention)[0] : client.config.prefix;
    if (msg.content.indexOf(prefix) !== 0) {
        return;
    }

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const name = args.shift();
    const cmd = client.commands.filter(x => x.name === name || (x.hasOwnProperty('aliases') ? x.aliases : []).includes(name)).array(); // Aliases
    if (!cmd.length) {
        return;
    }

    // permissions
    const command = cmd[0];
    if (command.ownerOnly && !client.config.owners.includes(msg.author.id)) {
      return;
    }

    if (command.permissions !== undefined && Array.isArray(command.permissions) && msg.guild) { // Permissions stuff
      const doesntHave = command.permissions.some(x => !msg.member.permissions.has(x));
      if (doesntHave) {
        const missing = command.permissions.filter(x => !msg.member.permissions.has(x));
        return msg.channel.send(`You're missing the following permissions: ${missing.join(', ')}`);
      }
    }

    try {
      console.log('Attempting to run cmd ' + command.name + ' (ran by ' + msg.author.id + ')');
      command.execute(client, msg, args);
    } catch (err) {
      console.error(err);
      return msg.channel.send("```" + err + "```");
    }
};
