import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../Command";
import {inspect} from "util";


export default class Eval extends Command {
    constructor (client) {
        super (client, {
            name: "eval",
            description: "Eval code",
      slash: {
                name: "eval",
                description: "eval code",
                options: [
                    {
                        type: "STRING",
                        name: "code",
                        description: "Code to evaluate",
                        required: true
                    }
                ]
            }
        });
    };

    async run (message: Message, args: string[]) {
        // @ts-ignore
        if (!process.env.developers.includes(message.author.id)) return;

        let hrDiff = process.hrtime(process.hrtime());
        let isPromise = false;

        let code = args.join(' ').replace('```js', '').replace('```', '')
        const dscformat = (lang, value) => (`\`\`\`${lang}\n${value}\n\`\`\``).replace(new RegExp(this.client.token, 'g'), [...this.client.token].map((v, i, a) => a[Math.floor(Math.random() * a.length)]).join(''))

        try {
            let evaled = eval(code);
            if(!code) evaled = 'Add something to eval dumbass.'
            if (code.includes(`BOTTOKEN`) || code.includes(`TOKEN`) || code.includes(`token`) || code.includes('process.env.token') || code.includes('client.token') || code.includes('child_process')) {
                evaled = new RegExp(this.client.token, 'g'), [...this.client.token].map((v, i, a) => a[Math.floor(Math.random() * a.length)]).join('')
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
            await message.channel.send({embeds: [embed]});
        } catch (e) {
            const embed = new MessageEmbed()
                .setDescription(`:inbox_tray: **Input** :inbox_tray: ${dscformat('js', args.join(' '))}\n:outbox_tray: **Output** :outbox_tray:\n${dscformat('js', e)}`)
                .addField('Time', ` \`\`\`js\n${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}\`\`\` `)
                .setColor('#FF0000')
            await message.channel.send({embeds: [embed]});
        }

    };
};
