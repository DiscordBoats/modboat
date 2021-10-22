const { preconditions } = require('../functions/preconditions');

const automodInvites = require('../functions/automod/invites');
const automodSlurs = require('../functions/automod/slurs');
const automodMassmention = require('../functions/automod/massmention');
const automodScam = require('../functions/automod/scam');

module.exports = (client, msg) => {
  if (msg.author.bot || !msg.guild) {
    return;
  }

  // automod
  if (msg.content && client.settings.automod) {
    automodInvites(client, msg);
    automodSlurs(client, msg);
    automodMassmention(client, msg);
    automodScam(client, msg);
  }

  // prefix stuff
  const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
  const prefix = msg.content.match(prefixMention) ? msg.content.match(prefixMention)[0] : (client.settings.prefix || client.config.defaultPrefix);
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
  const runPreconditions = preconditions(client, msg, command);
  if (runPreconditions) {
    return;
  }

  try {
    client.log.info('Attempting to run cmd ' + command.name + ' (ran by ' + msg.author.id + ')');
    command.execute(client, msg, args);
  } catch (err) {
    client.log.error(err);
    return msg.channel.send("```" + err + "```");
  }
};
