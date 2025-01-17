const { Client, GatewayIntentBits } = require('discord.js');
const IIMDB = require('iimdb.js');

const db = new IIMDB();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === '!prayer') {
    const result = db.sendPrayer(client.user.id, 1);
    if (result.prayers.length > 0) {
      message.channel.send(`${result.prayers[0]}`);
    } else {
      message.channel.send('You have received all available prayers for today. Try again tomorrow');
    }
  }
});

client.login('BOT_TOKEN');
