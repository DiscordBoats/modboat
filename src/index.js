const { readdir } = require('fs').promises;
const { Client, Collection, MessageEmbed } = require('discord.js');
const Logger = require('leekslazylogger');

const client = new Client({
  disableEveryone: true,
  autoReconnect: true
});

global.MessageEmbed = MessageEmbed
client.db = require('better-sqlite3')('database.db');
client.db.pragma('journal_mode = WAL');
client.log = new Logger();
client.automod = require('./automod.json');
client.config = require('./config.json');
client.emoji = require('./functions/emoji');
client.commands = new Collection();
client.snipes = new Collection();

const init = async () => {
  const events = await readdir('./events');
  events.forEach(file => {
    const event = require(`./events/${file}`);
    client.on(file.split('.')[0], event.bind(null, client));
  });

  const categories = await readdir('./commands');
  categories.forEach(async category => {
    const commands = await readdir(`./commands/${category}`);
    commands.forEach(file => client.commands.set(file.split('.')[0], require(`./commands/${category}/${file}`)));
  });
}

init();

client.login(client.config.token);