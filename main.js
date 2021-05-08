const Discord = require("discord.js");
const client = new Discord.Client();
const keepAlive = require("./server.js");
const mongoose = require("mongoose");
const Xp = require("./xpSchema.js");
const htmlToPng = require("./htmltoPng.js");

const sendEmbed = (msg, data, isarray) => {
  const res = data;
  var result;

  if (isarray) {
    if (data[1]) {
      result = res.map(({ name, xp }) => `${name}: ${xp}`).join("\n");
    } else {
      result = `${data.name}: ${data.xp}`;
    }
  } else {
    result = data;
  }

  const embed = new Discord.MessageEmbed()
    .setColor(
      "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")
    )
    .setTitle("Leaderboard")
    .setDescription(result);

  msg.reply(embed);
};

client.on("ready", () => {
  console.log("Logged in!");

  const connection_url = process.env.DB_URL;
  mongoose
    .connect(connection_url, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => {
      console.log(err);
    });
});

client.on("message", (msg) => {
  const prefix = "lp!";

  if (msg.channel.type === "dm") return;
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) {
    Xp.findOne(
      {
        userId: msg.author.id,
      },
      (err, data) => {
        if (!data && !err)
          Xp.create({
            userId: msg.author.id,
            name: msg.author.username,
            xp: 4,
          });
        else if (data && !err) {
          Xp.updateOne(
            { userId: msg.author.id },
            {
              $set: {
                xp: data.xp + 4,
              },
            }
          ).exec();
        }
      }
    );

    return;
  }

  var msgContent = msg.content.substring(3).toLocaleLowerCase();

  if (msgContent === "leaderboard") {
    Xp.find({})
      .sort({ xp: "descending" })
      .exec((err, data) => {
        if (!err) sendEmbed(msg, data, true);
      });
  } else if (msgContent.substring(0, 8) === "userinfo") {
    const user = msg.mentions.users.first();
    if (user === undefined) return;

    Xp.findOne({ userId: user.id }, (err, data) => {
      if (!data && !err)
        sendEmbed(
          msg,
          `<@!${user.id}> has no xp. Earn some xp by chatting in the server`,
          false
        );
      else if (!err && data) sendEmbed(msg, data, true);
    });
  } else if (msgContent.substring(0, 4) === "sell") {
    const user = msg.mentions.users.first();

    var amountn = msgContent.split(" ");
    const amount = amountn[amountn.length - 1];

    if (user === undefined) return;
    else if (user.id === msg.author.id)
      sendEmbed(
        msg,
        `<@!${msg.author.id}>, You can't sell your own xp to yourself`,
        false
      );

    Xp.findOne({ userId: msg.author.id }, (err, data) => {
      if (!err && !data)
        sendEmbed(
          msg,
          `<@!${msg.author.id}> don't have enough xp to sell your xp!`,
          false
        );
      else if (!err && data) {
        if (data.xp > amount) {
          Xp.findOne({ userId: user.id }, (err, giftUserData) => {
            if (!err && !giftUserData)
              sendEmbed(
                msg,
                `<@!${user.id}> should have atleast 1xp to sell money to him/her`,
                false
              );
            else if (!err && giftUserData) {
              Xp.updateOne(
                { userId: msg.author.id },
                {
                  $set: {
                    xp: data.xp - amount,
                  },
                }
              ).exec();

              Xp.updateOne(
                {
                  userId: user.id,
                },
                {
                  $set: {
                    xp: giftUserData.xp + Number(amount),
                  },
                }
              ).exec((err, ok) => {
                if (!err && ok)
                  sendEmbed(
                    msg,
                    `U have sold your ${amount} xp to <@!${
                      user.id
                    }>. \nYour existing balance is ${data.xp - amount}`,
                    false
                  );
              });
            }
          });
        } else {
          sendEmbed(
            msg,
            `<@!${msg.author.id}>, you don't have enough xp to sell`,
            false
          );
        }
      }
    });
  } else if (msgContent.substring(0, 7) === "fuckoff") {
    sendEmbed(msg, `<@!${msg.author.id}>, Fuck YOURSELF`, false);
  } else if (msgContent.substring(0, 4) === "html") {
    htmlToPng(msg, msg.author.avatarURL());
  }
});

keepAlive();

client.login(process.env.TOKEN);
