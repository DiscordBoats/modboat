import { Discord } from "./structures/Client";
import { config as dotenv } from "dotenv";
import mongoose from "mongoose";
dotenv();

const client = new Discord();

["error", "uncaughtException", "unhandledRejection"].forEach((error) => {
    require(`./errors/${error}`)(process);
});

["Event", "Command"].forEach((x) => {
    require(`./handlers/${x}`).default(client);
});


async function main () {

    mongoose.connect(String(process.env.Mongodb), {
        keepAlive: true
    });

    mongoose.connection.on("connected", () => {
        console.log("Database connected");
    });

    mongoose.connection.on("disconnected", () => {
        console.log("Database disconnected");
    });
    client.login(process.env.Token);
};

main().catch((err) => {
    return console.log(err);
});