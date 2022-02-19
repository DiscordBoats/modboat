import { Discord } from "../structures/Client";

import { Event as Evt } from "../core/Event";

import glob from "glob";
import path from "path";

export default function (client: Discord) {

    let events = glob.sync("./dist/core/events/**/**/*.js");

    for (let i = 0; i < events.length; i++) {

        let file = require(path.resolve(events[i]));

        if (file.default) {
            file = new file.default(client);
        };

        if (!(file instanceof Evt)) {
            return;
        };

        if (file.name) {

            (file.once !== true)
                ? client.on(file.name, (...args) => file.run(...args)) :
                client.once(file.name, (...args) => file.run(...args));
        };
    };
};