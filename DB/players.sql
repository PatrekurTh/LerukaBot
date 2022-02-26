DROP TABLE IF EXISTS players;

CREATE TABLE IF NOT EXISTS players(
	name VARCHAR,
	attackl INT DEFAULT 1,
	defencel INT DEFAULT 1,
	fishingl INT DEFAULT 1,
	miningl INT DEFAULT 1,
	attackxp INT DEFAULT 0,
	defencexp INT DEFAULT 0,
	fishingxp INT DEFAULT 0,
	miningxp INT DEFAULT 0,
	PRIMARY KEY (name)
);