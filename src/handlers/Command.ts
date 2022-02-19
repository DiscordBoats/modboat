import { Discord } from "../structures/Client";

import { Command as CMD } from "../core/Command";

import glob from "glob";
import path from "path";

export default function (client: Discord) {

    let commands = glob.sync("./dist/core/commands/**/**/*.js");

    for (let i = 0; i < commands.length; i++) {

        let file = require(path.resolve(commands[i]));

        if (file.default) {
            file = new file.default(client);
        };

        if (!(file instanceof CMD)) {
            return;
        };

        if (file.name) {
            client.commands.set(file.name, file);
        };
    };
};