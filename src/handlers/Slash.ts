import { Discord } from "../structures/Client";

import glob from "glob";
import path from "path";
import { Command } from "../core/Command";

export default function (client: Discord) {

    let array = [] as string[] | any;

    client.commands.forEach((x) => {
        
        if (x.slash) {
            array.push(x.slash);
            
            client.slashes.set(x.slash.name, x);
        };
    });

    client.guilds.cache.get("649159297271595017")?.commands.set(array);
};