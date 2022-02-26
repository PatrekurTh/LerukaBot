DROP TABLE IF EXISTS players;

CREATE TABLE IF NOT EXISTS players(
	name VARCHAR,
	attackxp INT DEFAULT 0,
	defencexp INT DEFAULT 0,
	fishingxp INT DEFAULT 0,
	miningxp INT DEFAULT 0,
	PRIMARY KEY (name)
);