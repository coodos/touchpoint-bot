import discord from "discord.js";
import { CONNECT_TRIGGER } from "../constants/triggers";
import { tryConnection } from "./connection.controller";

/**
 * Handle a message and perform the action we want it to perform
 *
 * @param {discord.Message} msg
 * @returns {Promise<void>}
 */

export const HandleMessage = async (
  msg: discord.Message,
  client: discord.Client
): Promise<void> => {
  // get the first word
  const command = msg.content.split(" ")[0].toLowerCase();

  // switch case by the command :)
  switch (command) {
    case CONNECT_TRIGGER:
      return tryConnection(msg, client);
  }
};
