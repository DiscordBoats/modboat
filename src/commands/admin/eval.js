const {MessageEmbed, Permissions} = require('discord.js');
const {inspect} = require('util');

module.exports = {
    name: 'eval',
    description: 'evaluate code',
    aliases: ['e', 'ev'],
    usage: '[code]',
    category: 'Admin',
    ownerOnly: true,
    async execute(client, msg, args) {
            let hrDiff = process.hrtime(process.hrtime());
            let isPromise = false;


            let code = args.join(' ').replace('```js', '').replace('```', '')
            const dscformat = (lang, value) => (`\`\`\`${lang}\n${value}\n\`\`\``).replace(new RegExp(client.token, 'g'), [...client.token].map((v, i, a) => a[Math.floor(Math.random() * a.length)]).join(''))

            try {
                let evaled = eval(code);
                if(!code) evaled = 'Add something to eval dumbass.'
                if (code.includes(`BOTTOKEN`) || code.includes(`TOKEN`) || code.includes('process.env.Token') || code.includes('client.token') || code.includes('child_process')) {
                    evaled = new RegExp(client.token, 'g'), [...client.token].map((v, i, a) => a[Math.floor(Math.random() * a.length)]).join('')
                }

                let isPromise = false;

                if (evaled && evaled instanceof Promise) {
                    isPromise = true;
                    evaled = await evaled;
                }
                if (typeof evaled !== 'string') {
                    evaled = inspect(evaled, {
                        depth: 0
                    });
                }

                const embed = new MessageEmbed()
                    .setColor('RANDOM')
                    .addField(`:inbox_tray: **Input** :inbox_tray:`, `${dscformat('js', args.join(' '))}`)
                    .setDescription(`:outbox_tray: **Output** :outbox_tray:\n${dscformat('js', evaled)}`)
                    .addField('Time', ` \`\`\`js\n${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}\`\`\` `)
                    .addField('Type of', dscformat('css', `${typeof evaled}${isPromise ? ' (Originally Promise)' : ''}`))
                await msg.channel.send({embeds: [embed]});
            } catch (e) {
                const embed = new MessageEmbed()
                    .setDescription(`:inbox_tray: **Input** :inbox_tray: ${dscformat('js', args.join(' '))}\n:outbox_tray: **Output** :outbox_tray:\n${dscformat('js', e)}`)
                    .addField('Time', ` \`\`\`js\n${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}\`\`\` `)
                    .addField('Type', dscformat('css', `${typeof evaled}${isPromise ? ' (Originally Promise)' : ''}`))
                    .setColor('#FF0000')
                await msg.channel.send({embeds: [embed]});
            }

    }
}