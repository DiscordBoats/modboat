import Tag from "../../../models/tags";
import { Discord } from "../../Client";

export class Create {
    public client: Discord;

    constructor(client: Discord) {
        this.client = client;
    };

    async tag(guildId: string, tag: string, response: string) {

        Tag.findOne({ Guild: guildId, Command: tag.toLowerCase() }, async (err, data) => {
            if (!data) {
                data = new Tag({
                    Guild: guildId,
                    Command: tag,
                    Response: response
                });

                data.save();
            };
        });
    };
};