import { log } from "console";
import { Client, Guild, GatewayIntentBits } from "discord.js";

export class Discord {
  private client: Client<boolean>;
  private guild: Guild | null;
  private log_ch: bigint;

  constructor() {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    this.client = client;
    this.guild = null;

    client.once("ready", () => {
      if (!client.user) return;
      console.log(`Logged in as ${client.user.tag}!`);
      const guild = client.guilds.cache.get(
        process.env.DISCORD_SERVER_ID as string,
      );
      if (guild === undefined) {
        console.error("Failed to get guild");
        return;
      }
      this.guild = guild;
    });

    this.log_ch = BigInt(process.env.DISCORD_LOG_CHANNEL_ID as string);

    client.login(process.env.DISCORD_BOT_TOKEN);
  }

  getClient() {
    return this.client;
  }

  getGuild() {
    return this.guild;
  }

  getLog() {
    return this.log_ch;
  }
}
