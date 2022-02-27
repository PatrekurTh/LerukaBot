DROP TABLE IF EXISTS playerInventory;

CREATE TABLE IF NOT EXISTS playerInventory(
	pname VARCHAR,
	itemid INT,
	itemamount INT,
	PRIMARY KEY (pname, itemname)
);