import Database from 'better-sqlite3';

const connection = Database('courses.db');

connection.exec(`

CREATE TABLE user (
    id INTEGER NOT NULL PRIMARY KEY,
    google_id TEXT NOT NULL,
    email TEXT NOT NULL,
    username TEXT NULL
);


CREATE TABLE session (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user(id),
    expires_at INTEGER NOT NULL
);

CREATE TABLE list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article TEXT NOT NULL,
    user_id INTEGER NOT NULL
);
    `);
