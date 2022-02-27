import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
});

export async function availableFish(fLevel) {
  const y = await pool.query(
    "SELECT * FROM fish WHERE flevel <= $1 ORDER BY cpercent",
    [fLevel]
  );
  return y.rows;
}

// vantar ores table
// async function availableOres(mLevel) {
//     const y = await pool.query('SELECT * FROM ores WHERE flevel <= $1 ORDER BY cpercent',[mLevel]);
//     return y.rows;
// }

export async function levels(skillxp) {
  const temp = {};
  for (let skill in skillxp) {
    // temp[skill]
    temp[skill] = (
      await pool.query("SELECT MAX(level) FROM xp WHERE xpneed <= $1", [
        skillxp[skill],
      ])
    ).rows[0].max;
    // console.log(x);
  }
  return temp;
}

export const getPlayers = async () => {
  const players = await pool.query("SELECT * FROM players");
  return players.rows;
};

export const addToInventory = (playerName, item) => {
  (async () => {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // player stats
      const queryText =
        "INSERT INTO playerInventory(pname, itemname, itemamount)\
            VALUES($1, $2, 1) ON CONFLICT (pname, itemname) DO UPDATE\
            SET itemamount = playerInventory.itemamount + 1 RETURNING *";
      const queryLis = [playerName, item.name];
      const res = await client.query(queryText, queryLis);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => console.error(e.stack));
};

export const updatePlayer = (player, inventory) => {
  (async () => {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // player stats
      const queryText =
        "UPDATE players\
            SET attackl = $1, defencel = $2, fishingl = $3, \
            miningl = $4, attackxp = $5, defencexp = $6, \
            fishingxp = $7, miningxp = $8 \
            WHERE name = $9 RETURNING *";
      const queryLis = [
        player.levels.attack,
        player.levels.defence,
        player.levels.fishing,
        player.levels.mining,
        player.xp.attack,
        player.xp.defence,
        player.xp.fishing,
        player.xp.mining,
        player.name,
      ];
      const res = await client.query(queryText, queryLis);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => console.error(e.stack));
};

export function registerPlayer(player) {
  (async () => {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const queryText = "INSERT INTO players(name) VALUES($1) RETURNING *";
      const res = await client.query(queryText, [player]);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => console.error(e.stack));
}

export const savePlayers = (players) => {
  console.log("running");
  const playersArr = [];
  for (let player in players) {
    let currentPlayer = players[player];
    playersArr.push(`(${currentPlayer.attackl}, ${currentPlayer.defencel}, ${currentPlayer.fishingl}, ${currentPlayer.miningl},
        ${currentPlayer.attackxp}, ${currentPlayer.defencexp}, ${currentPlayer.fishingxp}, ${currentPlayer.miningxp})`);
  }
  (async () => {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const queryText = "INSERT INTO players(name) VALUES $1 RETURNING *";
      const res = await client.query(queryText, [playersArr]);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => console.error(e.stack));
};

// saveInventory
