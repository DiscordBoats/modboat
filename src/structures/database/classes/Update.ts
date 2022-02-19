import { Discord } from "../../Client";
import Schema from "../../../models/guild";



export class Update {
    public client: Discord;
    constructor(client: Discord) {
        this.client = client;
    };


    async automod (guildId: string, type: Automod, toggle: boolean) {
        await Schema.findOne({ Guild: guildId }, async (err, schema) => {
            if (schema) {
                schema[type] = toggle,
                schema.save()
            } else {
                new Schema({
                    Guild: guildId,
                    [type]: toggle
                }).save()
            }
        }).clone()
    };

    async autorole(guildId: string, toggle: boolean) {
        await Schema.findOne({ Guild: guildId }, async (err, schema) => {
            if (schema) {
                schema.Autorole = toggle,
                schema.save()
            } else {
                new Schema({
                    Guild: guildId,
                    Autorole: toggle
                }).save()
            }
        }).clone()
    }


     rate (guildId: string, type: Rate, rate: number) {

        /*const data = {
            Guild: guildId
        };*/

        const data = {};

         Schema.findOne(data, (err, schema) => {
            
            data[type] = rate;

            if (!schema) {
                schema = new Schema(data);

                schema.save();
            } else {
                schema[type] = rate;
                schema.save();
            };
        });
    };

    muterole (guildid: string, roleid: string) {
    }

     logs (guildid: string, channelid: string) {
        Schema.findOne({ Guild: guildid }, async (err, data) => {
            if (data) {
                data.LogChannel = channelid
                data.save()
            } else {
                new Schema({
                    Guild: guildid,
                    LogChannel: channelid
                }).save()
            }
        })
    }

    modlogs(guildid: string, channelid: string) {
        Schema.findOne({ Guild: guildid }, async (err, data) => {
            if (data) {
                data.ModChannel = channelid
                data.save()
            } else {
                new Schema({
                    Guild: guildid,
                    ModChannel: channelid
                }).save()
            }
        })
    }

};



export type Rate = "Massmentionrate" | "Masscapsrate";

export type Automod = "Automodnword" 
| "Automodlinks" 
| "Automodads" 
| "Automodiploggers" 
| "Automodmassmention" 
| "Automodmasscaps" 
| "Automodipv4" 
| "Automodipv6" 