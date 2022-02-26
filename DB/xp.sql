DROP TABLE IF EXISTS xp;

CREATE TABLE IF NOT EXISTS xp(
	level SERIAL,
	xpNeed INT,
	PRIMARY KEY (level)
);

INSERT INTO xp(xpNeed) VALUES 
(0), (83), (174), (276), (388), (512), (650), (801), (969), (1154), -- 1->10
(1358), (1584), (1833), (2107), (2411), (2746), (3115), (3523), (3973), (4470), -- 10->20
(5018), (5624), (6291), (7028), (7842), (8740), (9730), (10824), (12031), (13363); -- 20->30