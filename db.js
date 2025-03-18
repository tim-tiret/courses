import Database from 'better-sqlite3';

const connection = Database('courses.db');

connection.exec(`

CREATE TABLE list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article TEXT NOT NULL
);


INSERT INTO list (article) VALUES
    ('Oeufs'),
    ('Fromage');
    `);
