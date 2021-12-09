import { BOT_TOKEN } from "./config";
import { HandleMessage } from "./controllers";
import discord from "discord.js";

const client = new discord.Client({
  intents: [
    discord.Intents.FLAGS.GUILD_MEMBERS,
    discord.Intents.FLAGS.GUILD_MESSAGES,
    discord.Intents.FLAGS.GUILDS,
  ],
});

client.on("messageCreate", HandleMessage);

client.on("ready", () => {
  console.log("touchpoint initiated");
});

client.login(BOT_TOKEN);
