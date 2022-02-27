import tmi from "tmi.js";
import "dotenv/config";
import {
  registerPlayer,
  availableFish,
  addToInventory,
  savePlayers,
  getPlayers,
} from "./DB/db.js";

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();

const commands = ["!register", "!fish", "!stats", "!status", "!mine", "!bag"];
const player_status = {};
// do we need this?
const playerInventory = {};
const gatheringTick = 5000; // gathering interval
const saveTick = 1800000; // database update - 30 minutes
const players = {};
let start_time;
let tick;

class player {
  constructor(name) {
    this.name = name;
    this.attackl = 1;
    this.defencel = 1;
    this.fishingl = 1;
    this.miningl = 1;
    this.attackxp = 0;
    this.defencexp = 0;
    this.fishingxp = 0;
    this.miningxp = 0;
  }
}
// function sem sækir top 10 úr players fyrir hvert skill xp

// Called every time a message comes in
const onMessageHandler = async (channel, userstate, message, self) => {
  if (self) {
    return;
  } // Ignore messages from the bot

  const uName = userstate["display-name"];
  // Remove whitespace from chat message
  const commandName = message.trim();

  switch (commandName) {
    case "!commands":
      let announce_str = "The commands are: ";
      commands.forEach((command) => (announce_str += `${command} `));
      client.say(channel, announce_str);
      break;
    case "!register":
      if (playerIsRegistered(uName, channel)) {
        client.say(
          channel,
          `${uName} is already registered, use !commands to see what you can do!`
        );
        return;
      }
      players[uName] = new player(uName);
      registerPlayer(uName);
      playerInventory[uName] = {};
      player_status[uName] = { action: "Nothing", time: 0 };
      client.say(
        channel,
        `Welcome ${uName}, use !commands to see what you can do!`
      );
      break;
    case "!fish":
      if (!playerIsRegistered(uName, channel)) return;
      if (player_status[uName].action !== "Fishing") {
        const loot_table = await availableFish(players[uName].fishingl);
        start_time = new Date().getTime();
        player_status[uName].action = "Fishing";
        player_status[uName].time = start_time;
        client.say(channel, `${uName} started fishing.`);
        tick = setInterval(() => {
          gathering(uName, loot_table);
          if (player_status[uName].action !== "Fishing") {
            clearInterval(tick);
          }
        }, gatheringTick);
      }
      break;
    case "!mine":
      // missing ores table
      // const loot_table = await availableOres(players[uName].levels.mining);
      if (!playerIsRegistered(uName, channel)) return;
      start_time = new Date().getTime();
      player_status[uName].action = "Mining";
      player_status[uName].time = start_time;
      tick = setInterval(() => {
        mining(uName, loot_table);
        if (player_status[uName].action !== "Mining") {
          clearInterval(tick);
        }
      }, gatheringTick);
      break;
    case "!stats":
      if (!playerIsRegistered(uName, channel)) return;
      refreshPlayerList();
      const stat_str = `[Attack: ${players[uName].attackl}] [Defence: ${players[uName].defencel}] [Fishing: ${players[uName].fishingl}] [Mining: ${players[uName].miningl}]`;
      client.say(channel, stat_str);
      break;
    case "!status":
      if (!playerIsRegistered(uName, channel)) return;
      const now_time = new Date().getTime();
      client.say(
        channel,
        `${uName} has been ${player_status[uName].action} for ${Math.round(
          (now_time - player_status[uName].time) / 60000
        )} minutes.`
      );
      break;
    case "!bag":
      if (!playerIsRegistered(uName, channel)) return;
      console.log(playerInventory[uName]);
      break;
    case "POG":
      client.say(channel, `${uName} CHAMP`);
      break;
  }
};

// generalize for professions
const gathering = (name, drops) => {
  console.log("running");
  const roll = Math.random();
  for (let i = 0, j = drops.length; i < j; i++) {
    if (roll <= drops[i].cpercent) {
      // add to inventory
      addToInventory(name, drops[i]);
      // give xp
      players[name].fishingxp += drops[i].fxp;
      // stop the loop
      break;
    }
  }
};

const refreshPlayerList = async () => {
  const tmpPlayers = await getPlayers();
  tmpPlayers.forEach((v) => {
    players[v.name] = v;
  });
};

const populatePlayerStates = () => {
  for (let key in players) {
    player_status[key] = { action: "Nothing", time: 0 };
  }
};

// writes state of game into database
const saveState = () => {
  savePlayers(players);
  //   saveInventory(playerInventory);
};

const startUp = async () => {
  await refreshPlayerList();
  populatePlayerStates();
};

// Called every time the bot connects to Twitch chat
const onConnectedHandler = (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`);
  startUp();
};

const playerIsRegistered = (uname, channel) => {
  if (!(uname in players)) {
    console.log("inside func");
    client.say(channel, "Please use !register to register");
    return false;
  }
  return true;
};
