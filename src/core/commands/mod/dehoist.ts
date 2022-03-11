import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../Command";
import {inspect} from "util";


export default class Dehoist extends Command {
    constructor (client) {
        super (client, {
            name: "dehoist",
            description: "Eval code",
        });
    };

    async run (message: Message, args: string[]) {
        const filter = (map, pred) => {
            const result = new Map();
            for (let [k, v] of map) {
                if (pred(k, v)) {
                    result.set(k, v);
                }
            }
            return result;
        }


        await (await message.guild.members.fetch()).forEach(member => {
            member.setNickname(member.user.username.replace(/[^a-zA-Z0-9\s]/g, "")).catch(e => {
                return
            })

        })
        message.channel.send("Dehoisted")
    };
};
