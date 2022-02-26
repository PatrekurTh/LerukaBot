DROP TABLE IF EXISTS fish;

CREATE TABLE IF NOT EXISTS fish(
	id SERIAL,
	name VARCHAR(30),
	cpercent REAL,
	flevel INT,
	fxp INT,
	clevel INT,
	cxp INT,
	tool VARCHAR(50),
	PRIMARY KEY (id)
);

INSERT INTO fish(name, cpercent, flevel, fxp, clevel, cxp, tool)
VALUES ('Shrimp', 0.8, 1, 10, 1, 30, 'Net'),
		('Crayfish', 0.4, 1, 10, 1, 30, 'Cage'),
		('Sardine', 0.2, 5, 20, 1, 40, 'Fishing Rod'),
		('Herring', 0.1, 10, 30, 5, 50, 'Fishing Rod'),
		('Anchovies', 0.1, 15, 40, 1, 30, 'Net');