DROP TABLE IF EXISTS fish;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS xp;

CREATE TABLE IF NOT EXISTS items(
	id SERIAL,
	name VARCHAR,
	vendorp INT DEFAULT 0, -- used when gold & vendor implemented
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS fish(
	iid INT,
	cpercent REAL,
	flevel INT,
	fxp INT,
	clevel INT, -- for cooking later
	cxp INT, -- for cooking later
	tool VARCHAR, -- for tools later
	PRIMARY KEY (iid),
  FOREIGN KEY (iid) REFERENCES items (id)
);

CREATE TABLE IF NOT EXISTS xp(
	level SERIAL,
	xpNeed INT,
	PRIMARY KEY (level)
);