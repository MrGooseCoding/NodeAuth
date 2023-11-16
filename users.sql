BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "users" (
	"id"	TEXT NOT NULL,
	"email"	TEXT UNIQUE,
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"display_name"	TEXT NOT NULL,
	"description"	TEXT,
	"status"	INTEGER DEFAULT 0,
	"date_created"	DATETIME,
	"token"	TEXT UNIQUE,
	PRIMARY KEY("id")
);
COMMIT;
