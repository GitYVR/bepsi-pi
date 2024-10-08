const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { DISCORD_CHANNEL_ID, DISCORD_TOKEN } = require("../env");
const { dispenseFromDiscord } = require("../machine");
const { VENDOR_SELECTION_TO_PIN_MAPPING } = require("../constants.js")
const { sleep } = require("../common.js")

const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];

let lowInventoryMessages = {
  1: undefined,
  2: undefined,
  3: undefined,
  4: undefined,
  5: undefined,
  6: undefined,
}

async function updateInventoryMessage(hopper, isLow) {
  while (!client.isReady()) {
    console.log("Waiting for discord client...")
    await sleep(1000)
  }
  const currMessageId = lowInventoryMessages[hopper]
  const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);

  if (isLow && currMessageId == undefined) {
    // Send low inventory message when pin is triggered
    const message = await channel.send(`HOPPER ${emojis[hopper - 1]} IS LOW!!! (Less than 6 left)`);
    lowInventoryMessages[hopper] = message.id

  } else if (!isLow && currMessageId !== undefined) {
    // Delete low inventory message when refilled
    await (await channel.messages.fetch(currMessageId)).delete()
  }
}

async function main() {
  console.log("Discord Bepsi listener is ready!");
  console.log(`[Discord] Logged in as ${client.user.tag}!`);

  const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
  const oldMessages = await channel.messages.fetch({limit: 100});
  await channel.bulkDelete(oldMessages);

  const message = await channel.send("Bitpepsi for all!");

  emojis.forEach(emoji => message.react(emoji))

  client.on("messageReactionAdd", async (reaction, user) => {
    // Ignore bot's own reaction
    if (user.id === client.user.id) {
      return;
    }

    // Disreacts it
    reaction.users.remove(user);

    // If the reaction was on the submitted message
    if (reaction.message.id !== message.id) {
      return;
    }

    // Make sure the reaction is one of the following
    // eslint-disable-next-line
    if (!emojis.includes(reaction._emoji.name)) {
      return;
    }

    // eslint-disable-next-line
    const pin = VENDOR_SELECTION_TO_PIN_MAPPING[emojis.indexOf(reaction._emoji.name) + 1]
    if (pin === undefined || pin === null) {
      return;
    }

    dispenseFromDiscord(pin);
  });
}

const startDiscordListener = () => {
  client.on("ready", main);
  client.login(DISCORD_TOKEN);
};

module.exports = {
  startDiscordListener,
  updateInventoryMessage,
};
