const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'settings',
    category: 'General',
    description: 'Change bot settings here',
    async execute(client, msg, args) {
        const setSettings = () => {
            const settings = client.db.prepare('SELECT * FROM settings').all() || { name: '', value: '' };
            const list = {};
            settings.forEach(setting => {
                list[setting.name] = setting.value;
            });
            client.settings = list;
        }

        switch (args[0]) {
            case 'prefix':
                if (!args[1]) {
                    return msg.channel.send('Please specify a new prefix');
                }

                if (args[1] === 'default') {
                    client.db.prepare('INSERT OR REPLACE INTO settings (name, value) VALUES (?, ?)').run('prefix', client.config.defaultPrefix);
                    setSettings();
                    return msg.channel.send(`Prefix changed to ${client.config.defaultPrefix}`);
                }
                client.db.prepare('INSERT OR REPLACE INTO settings (name, value) VALUES (?, ?)').run('prefix', args[1]);
                setSettings();
                msg.channel.send(`Prefix changed to ${args[1]}`);
                break;
            
            case 'memberlog':
            case 'messagelog':
            case 'modlog':
                if (!args[1]) {
                    return msg.channel.send('Please specify a channel');
                }

                if (args[1] === 'none') {
                    client.db.prepare('DELETE FROM settings WHERE name = ?').run(args[0]);
                    setSettings();
                    return msg.channel.send(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} channel disabled`);
                }

                let channel = args[1];
                channel = channel.replace('<#', '');
                channel = channel.replace('>', '');

                if (!msg.guild.channels.cache.find(c => c.id === channel)) {
                   return msg.channel.send('Please specify a valid channel');
                }

                client.db.prepare('INSERT OR REPLACE INTO settings (name, value) VALUES (?, ?)').run(args[0], args[1]);
                setSettings();
                msg.channel.send(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} channel changed to ${args[1]}`);
                break;

            case 'mutedrole':
            case 'modrole':
                if (!args[1]) {
                    return msg.channel.send('Please specify a role');
                }

                if (args[1] === 'none') {
                    client.db.prepare('DELETE FROM settings WHERE name = ?').run(args[0]);
                    setSettings();
                    return msg.channel.send(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} role disabled`);
                }

                let role = args[1];
                role = role.replace('<@&', '');
                role = role.replace('>', '');

                if (!msg.guild.roles.cache.find(r => r.id === role)) {
                    return msg.channel.send('Please specify a valid role');
                }

                client.db.prepare('INSERT OR REPLACE INTO settings (name, value) VALUES (?, ?)').run(args[0], args[1]);
                setSettings();
                msg.channel.send(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} role changed to ${args[1]}`);
                break;

            default: 
                const settings = client.db.prepare('SELECT * FROM settings').all() || { name: '', value: '' };
                const list = {};
                settings.forEach(setting => {
                    list[setting.name] = setting.value;
                });
                const embed = new MessageEmbed()
                    .setColor(0x00AE86)
                    .setTitle('Settings')
                    .setDescription('Current bot settings')
                    .addField('Prefix', list.prefix || client.config.defaultPrefix)
                    .addField('Mod log', list.modlog || 'None')
                    .addField('Member log', list.memberlog || 'None')
                    .addField('Message log', list.messagelog || 'None')
                    .addField('Muted role', list.mutedrole || 'None')
                    .addField('Mod role', list.modrole ||'None');
                msg.channel.send(embed);
        }
    }
}