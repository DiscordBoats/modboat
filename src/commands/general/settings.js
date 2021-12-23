const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'settings',
    category: 'General',
    description: 'Change bot settings here',
    permissions: ['BAN_MEMBERS'],
    async execute(client, msg, args) {
        const setSettings = () => {
            const settings = client.db.prepare('SELECT * FROM settings').all() || {name: '', value: ''};
            const list = {};
            settings.forEach(setting => {
                list[setting.name] = setting.value;
            });
            client.settings = list;
        }

        let settings, list;

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

                client.db.prepare('INSERT OR REPLACE INTO settings (name, value) VALUES (?, ?)').run(args[0], channel);
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

            case 'automod':
                switch (args[1]) {
                    case 'false':
                    case 'disable':
                    case 'off':
                    case 'enable':
                    case 'true':
                    case 'on':
                        client.db.prepare('INSERT OR REPLACE INTO settings (name, value) VALUES (?, ?)').run('automod', args[1]);
                        setSettings();
                        msg.channel.send(`Automod is now ${args[1]}`);
                        break;
                    default:
                        settings = client.db.prepare('SELECT * FROM settings').all() || {name: '', value: ''};
                        list = {};
                        settings.forEach(setting => {
                            if (!setting.name.startsWith('automod_')) {
                                return;
                            }
                            list[setting.name] = setting.value;
                        });

                        const embed = new MessageEmbed()
                            .setTitle('Automod')
                            .setDescription(`Automod is currently ${client.settings.automod ? 'enabled' : 'disabled'}. To see list of items in a automod category, run \`\`${client.settings.prefix || client.config.defaultPrefix}settings automod <item>\`\`.`)
                            .addField('Invites', list.automod_invites ? 'Enabled' : 'Disabled', true)
                            .addField('Scams', list.automod_scams ? 'Enabled' : 'Disabled', true)
                            .addField('Mass mentions', list.automod_massmentions ? 'Enabled' : 'Disabled', true)
                            .addField('Blacklisted words', list.automod_blacklistedwords ? 'Enabled' : 'Disabled', true);
                        await msg.channel.send({embeds: [embed]});
                }
                break;

            default:
                settings = client.db.prepare('SELECT * FROM settings').all() || {name: '', value: ''};
                list = {};
                settings.forEach(setting => {
                    if (setting.name.startsWith('automod_')) {
                        return;
                    }
                    list[setting.name] = setting.value;
                });

                const embed = new MessageEmbed()
                    .setColor(0x00AE86)
                    .setTitle('Settings')
                    .setDescription('Current bot settings')
                    .addField('Prefix', list.prefix || client.config.defaultPrefix, true)
                    .addField('Mod log', list.modlog ? `<#${list.modlog}>` : 'None', true)
                    .addField('Member log', list.memberlog ? `<#${list.memberlog}>` : 'None', true)
                    .addField('Message log', list.messagelog ? `<#${list.messagelog}>` : 'None', true)
                    .addField('Muted role', list.mutedrole ? `<@${list.mutedrole}>` : 'None', true)
                    .addField('Mod role', list.modrole ? `<@${list.modrole}>` : 'None', true)
                    .addField('Automod', list.automod ? 'Enabled' : 'Disabled', true);
                await msg.channel.send({embeds: [embed]});
        }
    }
}