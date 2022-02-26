import Tag from "../../../models/tags";
import { Discord } from "../../Client";

export class Get {
    public client: Discord;

    constructor(client) {
        this.client = client;
    };

    async tags(guildId: string) {

        const data = await Tag.find({ Guild: guildId });
        
        var tags = [];

        if (!data) {
            return null;
        };

        data.map((cmd, i) => {
            const { Command } = cmd;

            tags.push(Command);
        });

        return "`" + tags.join("` | `") + "`";
    };

    async tag(guildId: string, name: string) {

        const data = await Tag.findOne({ Guild: guildId, Command: name });
        if (data) {
            return data;
        } else {
            return null;
        };
    };
};