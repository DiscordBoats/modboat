module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands', 'cmds'],
	usage: '[command name]',
	category: 'General',
	execute(client, msg, args) {
		if (!args[0]) {
			const commands = client.commands.filter(x => !x.ownerOnly);
			const categories = {};

			for (const command of commands.values()) {
				if (!Object.keys(categories).includes(command.category)) {
					categories[command.category] = [];
				}
				categories[command.category].push(command);
			}

			const embed = {
				title: 'Commands List',
				description: [
					`To view documentation of a command, use \`${client.settings.prefix || client.config.defaultPrefix}help <name>\`.`,
					`**${client.commands.size}** command(s) available.`
				].join('\n'),
				fields: []
			};

			for (const cat of Object.keys(categories)) {
				if (!categories.hasOwnProperty(cat)) {
					continue;
				}

				embed.fields.push({
					name: `• ${cat} [${categories[cat].length}]`,
					value: categories[cat].map(x => `\`${x.name}\``).join(', ')
				});
			}

			return msg.channel.send({
				embed
			});
		} else {
			const name = args[0];
			const cmd = client.commands.filter(x => x.name === name);

			if (!cmd.size) {
				return msg.channel.send(`Command "${name}" doesn't exist`);
			} else {
				const meta = cmd.get(name);
				const embed = {
					title: `[ Command ${meta.name} ]`,
					description: meta.description,
					fields: [{
						name: 'Category',
						value: meta.category,
						inline: true
					}]
				};

				if (meta.hasOwnProperty('aliases')) {
					const aliases = meta.aliases;
					embed.fields.push({
						name: 'Aliases',
						value: aliases.join(', '),
						inline: true
					});
				}

				return msg.channel.send({
					embed
				});
			}
		}
	}
};
