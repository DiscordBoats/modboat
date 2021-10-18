const db = require('better-sqlite3')('database.db');

db.prepare('CREATE TABLE "cases" ("number" INTEGER, "message_id" TEXT, PRIMARY KEY("number" AUTOINCREMENT))').run();
db.prepare('CREATE TABLE "tags" ("name"	TEXT, "title" TEXT, "description" TEXT, "image" TEXT, PRIMARY KEY("name"))').run();
db.prepare('CREATE TABLE "mutes" ("id" TEXT, "expires" INTEGER, "CASE" text, PRIMARY KEY("id"))').run();
db.prepare('CREATE TABLE "warns" ("id" TEXT, "number" INTEGER, PRIMARY KEY("id"))').run();
