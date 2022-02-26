DROP TABLE IF EXISTS playerInventory;

CREATE TABLE IF NOT EXISTS playerInventory(
	pname VARCHAR,
	itemname VARCHAR,
	itemamount INT,
	PRIMARY KEY (pname, itemname)
);