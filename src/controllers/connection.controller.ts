import discord, { DiscordAPIError } from "discord.js";
import { BASE_ROLES, TOUCHPOINT_CATEGORY } from "../config";

/**
 * Create a new private channel with all the mentioned users and then
 * ping the users in that newly created channel
 *
 * @param {discord.Message} msg
 * @param {discord.Client} client
 */
export const tryConnection = async (
  msg: discord.Message,
  client: discord.Client
) => {
  const users = msg.mentions.users;
  if (users && msg.guild && users.size >= 2) {
    // split at the ">" and get the last word, the reason
    // we do it this way is because the mentions translate
    // to <@foo-bar> and then we can get the word after a ping
    const channelName = msg.content
      .split(">")
      [msg.content.split(">").length - 1].trim();

    const channel = await msg.guild?.channels.create(channelName, {
      parent: TOUCHPOINT_CATEGORY,
    });

    // make it invisible to everyone
    await channel?.permissionOverwrites.edit(msg.guild.roles.everyone, {
      VIEW_CHANNEL: false,
      SEND_MESSAGES: false,
      CREATE_PRIVATE_THREADS: false,
      CREATE_PUBLIC_THREADS: false,
    });

    // @ts-ignore
    await channel.permissionOverwrites.edit(client.user.id, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
    });

    await Promise.all(
      BASE_ROLES.map(async (roleId) => {
        const role = await msg.guild?.roles.fetch(roleId);
        if (role) {
          await channel.permissionOverwrites.edit(role, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
          });
        }
      })
    );

    await Promise.all(
      users.map(async (user) => {
        // make it visible to the users
        await channel?.permissionOverwrites.edit(user, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
          CREATE_PRIVATE_THREADS: true,
          CREATE_PUBLIC_THREADS: true,
        });
      })
    );

    msg.channel.send("created channel");

    let pingMessage = `Welcome to ${channelName}\n`;
    users.forEach((user) => {
      pingMessage = `${pingMessage} ${user} `;
    });
    channel.send(pingMessage);
  } else {
    msg.channel.send("mention atleast 2 users");
  }
};
