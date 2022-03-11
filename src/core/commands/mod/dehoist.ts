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
        // @ts-ignore
        const array = []; // eslint-disable-line

        (await message.guild.members.fetch()).forEach(member => {
            // @ts-ignore

            if(/[^a-zA-Z0-9\s\w]/g.test(member.user.username) || /[^a-zA-Z0-9\s\w]/g.test(member.nickname)) {
                array.push(member.user.id)
                member.setNickname(member.user.username.replace(/[^a-zA-Z0-9\s\w]/g, " ")).catch(e => {
                    return
                })
            }


        })
        return message.channel.send("Dehoisted " + array.length + " member(s)")
    };
};
