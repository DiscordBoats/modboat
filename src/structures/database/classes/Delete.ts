import Tag from "../../../models/tags";
import Autor from "../../../models/guild";
import { Discord } from "../../Client";

export class Delete {
    public client: Discord;

    constructor(client: Discord) {
        this.client = client;
    };

    async tag(guildId: string, tag: string) {

        Tag.findOne({ Guild: guildId, Command: tag.toLowerCase() }, async (err, data) => {

            if (data) {
                data.delete();
            } else {
                return;
            };
        });
    };
};