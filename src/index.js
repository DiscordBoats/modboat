const {readdir} = require('fs').promises;
const {Client, Collection} = require('discord.js');
const Logger = require('leekslazylogger');

const client = new Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"], 
    intents: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384],
    disableEveryone: true,
    autoReconnect: true
});
client.db = require('better-sqlite3')('database.db');
client.db.pragma('journal_mode = WAL');
client.log = new Logger();
client.automod = require('./automod.json');
client.config = require('./config.json');
client.emoji = require('./Functions/emoji');
client.time = require('./Functions/timeout')
client.snipes = new Collection();
["aliases", "commands"].forEach((x) => (client[x] = new Collection()));

const settings = client.db.prepare('SELECT * FROM settings').all() || {name: '', value: ''};
const list = {};
settings.forEach(setting => {
    list[setting.name] = setting.value;
});
client.settings = list;

const init = async () => {
    const events = await readdir('./events');
    events.forEach(file => {
        const event = require(`./events/${file}`);
        client.on(file.split('.')[0], event.bind(null, client));
    });

    const categories = await readdir('./commands');
    for (const category of categories) {
        const commands = await readdir(`./commands/${category}`);
        for (const file of commands) {
            await client.commands.set(file.split('.')[0], require(`./commands/${category}/${file}`));

        }
    }
}

init().then(r => r);

process.on('unhandledRejection', (err) => {
    client.log.error(err);
});

client.on('error', (err) => {
    client.log.error(err);
});

client.login(client.config.token);