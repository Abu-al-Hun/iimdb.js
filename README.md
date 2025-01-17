# iimdb.js

iimdb.js is an Islamic library designed to store Hadiths and supplications. This library simplifies the management of Islamic data in a structured and efficient manner.

![Skoda Studio Logo](https://media.discordapp.net/attachments/1282651782866272257/1322635767134027826/Skoda_1.png?ex=678bf60c&is=678aa48c&hm=1a2ba655335e1a287a0ac68713d95b9c88167bac8962adb1bd19d651432eaa45&=&format=webp&quality=lossless)

---

## **Library Features**

- **Storing Hadiths:** Simplifies managing Hadiths.
- **Managing Supplications:** Provides structured methods for organizing supplications.

---

## **Supported Node.js Versions**

The library supports the following Node.js versions:

- 14.x
- 16.x
- 18.x and above

---

## **How to Use**

### Installation

Install the library using npm:

```bash
npm install iimdb.js
```

### Example Usage

Here is an example of how to use the library with a Discord bot:

```javascript
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
```

---

## **Author**

The library was developed by passionate developers from Skoda Studio to spread Islamic knowledge in the digital world.

---

## **Repository Link**

Visit the GitHub repository for more details: [iimdb.js GitHub Repository](https://github.com/Abu-al-Hun/iimdb)

---

## **Git Commands**

### Clone the Repository

```bash
git clone https://github.com/Abu-al-Hun/iimdb.git
```
