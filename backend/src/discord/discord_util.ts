import { ChannelType, Guild, OverwriteType, PermissionOverwrites, PermissionFlagsBits, PermissionsBitField, TextChannel } from "discord.js";
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
  static async createRole(guild: Guild | null, roleName: string): Promise<string | null> {
    if (guild === null) return null;

    try {
        const role = await guild.roles.create({
            name: roleName,
            permissions: [], // すべての権限を無効にする
        });
        console.log(`ロール作成: ${roleName} (ID: ${role.id})`);
        return role.id; // ロールのIDを返す
    } catch (error) {
        console.error(`ロール作成エラー: ${error}`);
        return null;
    }
}

static async createChannel(
    guild: Guild | null,
    channelName: string,
    onlyRead: string[] | null = null,
): Promise<string | null> {
    if (guild === null) return null;

    try {
      const permissionOverwrites: {
        id: string;
        allow?: bigint[];
        deny?: bigint[];
    }[] = [
        {
            id: guild.id, // @everyoneロール
            deny: [PermissionFlagsBits.ViewChannel], // @everyoneに対する閲覧権限を拒否
        }
    ];

    // 指定されたロールの権限オーバーライトを追加
    if (onlyRead) {
        for (const roleId of onlyRead) {
            permissionOverwrites.push({
                id: roleId, // 閲覧権限を許可するロールID
                allow: [PermissionFlagsBits.ViewChannel], // このロールに対する閲覧権限を許可
            });
        }
    }

    // 指定された権限でチャンネルを作成
    const channel = await guild.channels.create({
        name: channelName, // チャンネルの名前
        type: ChannelType.GuildText,
        permissionOverwrites: permissionOverwrites, // 構築した権限オーバーライトを使用
    });
      console.log(`チャンネル作成: ${channelName} (ID: ${channel.id})`);
      return channel.id; // チャンネルのIDを返す
    } catch (error) {
        console.error(`チャンネル作成エラー: ${error}`);
        return null;
    }
}

}
