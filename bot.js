const tmi = require('tmi.js');
require('dotenv').config()
const db = require('./DB/db')

// Define configuration options
const opts = {
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN
    },
    channels: [
        process.env.CHANNEL_NAME
    ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

const commands = ['!register', '!fish', '!stats', '!status', '!mine', '!bag'];
const player_status = {};
// do we need this?
const playerInventory = {};
const gatheringTick = 5000; // gathering interval
const saveTick = 1800000 // database update - 30 minutes
const players = {};
let start_time;
let tick;

function player(name) {
    this.name = name
    this.attackl = 1
    this.defencel = 1
    this.fishingl = 1
    this.miningl = 1
    this.attackxp = 0
    this.defencexp = 0
    this.fishingxp = 0
    this.miningxp = 0
}
// function sem sækir top 10 úr players fyrir hvert skill xp

// Called every time a message comes in
async function onMessageHandler (channel, userstate, message, self) {
    if (self) { return; } // Ignore messages from the bot

    const uName = userstate['display-name'];
    // Remove whitespace from chat message
    const commandName = message.trim();

    switch (commandName) {
        case "!bla":
            db.savePlayers(players);
            break;
        case "!commands":
            announce_str = "The commands are: "
            for (let command in commands) {
                announce_str += `${commands[command]} `
            }
            client.say(channel, announce_str);
            break;
        case "!blah":
            // register player...  rename?
            players[uName] = new player(uName)
            // db.registerPlayer(uName);
            playerInventory[uName] = {};
            player_status[uName] = {action: 'Nothing', time: 0};
            break;
        case "!fish":
            if (player_status[uName].action !== "Fishing") {
                const loot_table = await db.availableFish(players[uName].fishingl);
                start_time = new Date().getTime();
                player_status[uName].action = "Fishing";
                player_status[uName].time = start_time;
                client.say(channel, `${uName} started fishing.`);
                tick = setInterval(()=> {
                    gathering(uName, loot_table);
                    if (player_status[uName].action !== 'Fishing') {
                        clearInterval(tick);
                    }
                }, gatheringTick)
            }
            break;
        case "!mine":
            // missing ores table
            // const loot_table = await db.availableOres(players[uName].levels.mining);
            start_time = new Date().getTime();
            player_status[uName].action = "Mining";
            player_status[uName].time = start_time;
            tick = setInterval(()=> {
                mining(uName, loot_table);
                if (player_status[uName].action !== 'Mining') {
                    clearInterval(tick);
                }
            }, gatheringTick)
            break;
        case "!stats":
            refreshPlayerList();
            const stat_str = `[Attack: ${players[uName].attackl}] [Defence: ${players[uName].defencel}] [Fishing: ${players[uName].fishingl}] [Mining: ${players[uName].miningl}]`
            client.say(channel, stat_str);
            break;
        case "!status":
            const now_time = new Date().getTime();
            client.say(channel, `${uName} has been ${player_status[uName].action} for ${Math.round((now_time - player_status[uName].time) / 60000)} minutes.`)
            break;
        case "!bag":
            console.log(playerInventory[uName]);
            break;
        default:
            console.log("* Not a command");
            break;
    }
}

// generalize for professions
function gathering(name, drops) {
    console.log("running");
    const roll = Math.random();
    for (let i = 0, j = drops.length; i < j; i++) {
        if (roll <= drops[i].cpercent) {
            // add to inventory
            db.addToInventory(name, drops[i])
            // give xp
            players[name].fishingxp += drops[i].fxp;
            // stop the loop
            break;
        }
    }
}

// const refreshPlayerList = async () => {
//     const tmpPlayers = await db.getPlayers()
//     tmpPlayers.forEach(v => {
//         players[v.name] = v
//     })
// }

const populatePlayerStates = () => {
    for (let key in players) {
        player_status[key] = {action: "Nothing", time: 0};
    }
}

// writes state of game into database
const saveState = () => {
    db.savePlayers(players);
    db.saveInventory(playerInventory);
}

const startUp = async () => {
    await refreshPlayerList();
    populatePlayerStates();
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    // startUp();
}

