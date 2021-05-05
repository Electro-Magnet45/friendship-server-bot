const Discord = require("discord.js");
const client = new Discord.Client();
const keepAlive = require("./server.js");

client.on("ready", () => {
  console.log("Logged in!");
});

client.on("message", (msg) => {
  if (msg.channel.type === "dm") return;
  if (msg.author.bot) return;

  if (msg.content === "ping") {
    msg.reply("pong");
  }
});

keepAlive();

client.login(process.env.TOKEN);
