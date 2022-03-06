import { Discord } from "../../Client";
import Schema from "../../../models/guild";
import WarnSchema from "../../../models/warn";
import { GuildMember, Message, User } from "discord.js";
import { nanoid } from "nanoid";



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
        });
    };

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
        });
    };

    alts(guildid: string, channelid: string) {
        Schema.findOne({ Guild: guildid }, async (err, data) => {
            if (data) {
                data.AltsChannel = channelid
                data.save()
            } else {
                new Schema({
                    Guild: guildid,
                    AltsChannel: channelid
                }).save()
            }
        });
    };

    altType(guildid: string, type: altType) {
        const data = {};

         Schema.findOne(data, (err, schema) => {
            
            data['Alttype'] = type;

            if (!schema) {
                schema = new Schema(data);

                schema.save();
            } else {
                schema['Alttype'] = type;
                schema.save();
            };
        });
    }

    addWarning(options: addwarningopts) {
        WarnSchema.find({ Guild: options.GuildId }).sort([['descending']]).exec((err, data) => {
            const warns = new WarnSchema({
                User: options.UserId,
                Guild: options.GuildId,
                Reason: options.Reason,
                WarnNum: nanoid(6),
                MessageId: options.MessageId,
                ChannelId: options.ChannelId
            })
            warns.save()
        });
    };

    deleteWarning(options: deletewariongopts) {

        WarnSchema.findOneAndDelete({id: options.GuildId}, (err, res) => {
            if (err) console.log(err)
        })
    }

};



export type Rate = "Massmentionrate" | "Masscapsrate" | "Altaccountdays";

export type Automod = "Automodnword" 
| "Automodlinks" 
| "Automodads" 
| "Automodiploggers" 
| "Automodmassmention" 
| "Automodmasscaps" 
| "Automodipv4" 
| "Automodipv6" 

interface addwarningopts {
    UserId: string,
    GuildId: string,
    Reason: string | 'No reason provided',
    MessageId: string,
    ChannelId: string
}

interface deletewariongopts {
    UserId: string,
    GuildId: string,
    WarnNum: Number
}

export type altType = "kick" | "ban"