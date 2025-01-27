const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const IIMDB = require("iimdb.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
const iimdb = new IIMDB();

const API_KEYS = {
  prayers: "iimdb_1",
  radios: "iimdb_2",
  questions: "iimdb_3",
};

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const args = message.content.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "!prayers") {
    try {
      const count = parseInt(args[0]) || 1;
      const result = iimdb.getPrayers(
        API_KEYS.prayers,
        message.author.id,
        count
      );
      message.channel.send(`Prayers: ${result.prayers.join(", ")}`);
    } catch (error) {
      message.channel.send(`Error: ${error.message}`);
    }
  } else if (command === "!questions") {
    try {
      const result = iimdb.getQuestions(API_KEYS.questions, message.author.id);
      const questions = result.questions;

      if (questions && questions.length > 0) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        const question = questions[randomIndex];

        const answers = question.answers.join(", ");
        const correctAnswer = question.correctAnswer || "Not available";

        message.channel.send(
          `Question: ${question.question}\nAnswers: ${answers}\nCorrect Answer: ${correctAnswer}`
        );
      } else {
        message.channel.send("No questions available");
      }
    } catch (error) {
      message.channel.send(`Error: ${error.message}`);
    }
  } else if (command === "!radios") {
    try {
      const result = iimdb.getRadios(API_KEYS.radios, message.author.id);
      const radiosList = result.radios;

      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("radio_select")
          .setPlaceholder("Choose a radio")
          .addOptions(
            Object.entries(radiosList).map(([name, link]) => ({
              label: name,
              value: name,
            }))
          )
      );

      await message.channel.send({
        content: "Select a radio to play:",
        components: [row],
      });
    } catch (error) {
      message.channel.send(`Error: ${error.message}`);
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  const selectedRadioName = interaction.values[0];
  const result = iimdb.getRadios(API_KEYS.radios, interaction.user.id);
  const selectedRadioLink = result.radios[selectedRadioName];

  const member = interaction.member;
  const voiceChannel = member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply("You need to join a voice channel first");
  }

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();

  const resource = createAudioResource(
    ffmpeg(selectedRadioLink)
      .setFfmpegPath(ffmpegPath)
      .audioCodec("libopus")
      .format("ogg")
      .pipe()
  );

  player.play(resource);
  connection.subscribe(player);

  if (!interaction.replied) {
    await interaction.reply(`Now playing: ${selectedRadioName}`);
  }

  player.on(AudioPlayerStatus.Idle, () => {
    connection.destroy();
  });

  player.on("error", (error) => {
    if (!interaction.replied) {
      interaction.reply(`Error playing the radio: ${error.message}`);
    }
    connection.destroy();
  });
});

client.login("TOKEN");
