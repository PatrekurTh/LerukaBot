-- **** WARNING **** RUNNING THIS WILL WIPE ALL PROGRESSION!!!
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS player;

CREATE TABLE IF NOT EXISTS player(
	name VARCHAR,
	attackxp INT DEFAULT 0,
	defencexp INT DEFAULT 0,
	fishingxp INT DEFAULT 0,
	miningxp INT DEFAULT 0,
	PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS inventory(
	iid INT,
	pname VARCHAR,
	amount INT,
	PRIMARY KEY (iid, pname),
	FOREIGN KEY (iid) REFERENCES items (id),
	FOREIGN KEY (pname) REFERENCES player (name)
);