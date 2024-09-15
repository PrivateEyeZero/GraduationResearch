import { Guild, PermissionsBitField, TextChannel } from "discord.js";
import { discord } from "../server";

export class DiscordUtil {
  static async getUserRoles(
    guild: Guild | null,
    userId: string,
  ): Promise<string[]> {
    if (guild === null) return [];

    try {
      const member = await guild.members.fetch(userId);

      return member.roles.cache.map((role) => role.id);
    } catch (error) {
      console.error(`Error fetching user roles: ${error}`);
      return [];
    }
  }

  static async authUserRole(
    guild: Guild | null,
    userId: string,
    roleId: string,
  ): Promise<boolean> {
    if (guild === null) return false;

    try {
      const member = await guild.members.fetch(userId);
      return member.roles.cache.has(roleId);
    } catch (error) {
      console.error(`Error checking user role: ${error}`);
      return false;
    }
  }

  static async isRoleManager(
    guild: Guild | null,
    userId: string,
  ): Promise<boolean> {
    if (guild === null) return false;
    try {
      const member = await guild.members.fetch(userId);
      return (
        member.permissions.has(PermissionsBitField.Flags.ManageRoles) ||
        member.permissions.has(PermissionsBitField.Flags.Administrator)
      );
    } catch (error) {
      console.error(`Error checking user permissions: ${error}`);
      return false;
    }
  }

  static async sendMessage(
    channelId: string | bigint,
    msg: string,
  ): Promise<void> {
    const id = typeof channelId === "string" ? BigInt(channelId) : channelId;

    try {
      const client = discord.getClient();
      const channel = await client.channels.fetch(id.toString());

      if (channel && channel instanceof TextChannel) {
        // メッセージを送信
        await channel.send(msg);
        console.log(`Message sent to channel ${id}`);
      } else {
        console.error(`Channel ${id} is not a text channel or not found`);
      }
    } catch (error) {
      console.error(`Error sending message: ${error}`);
    }
  }

  static async sendLog(msg: string): Promise<void> {
    try {
      const client = discord.getClient();
      const channelId = discord.getLog();
      const channel = await client.channels.fetch(channelId.toString());

      if (channel && channel instanceof TextChannel) {
        // メッセージを送信
        await (channel as TextChannel).send(msg);
        console.log(`Message sent to channel ${channelId}`);
      } else {
        console.error(
          `Channel ${channelId} is not a text channel or not found`,
        );
      }
    } catch (error) {
      console.error(`Error sending message: ${error}`);
    }
  }
}
