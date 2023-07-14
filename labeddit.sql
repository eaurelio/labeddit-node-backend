-- Active: 1688048706627@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL
    );

create TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER,
        dislikes INTEGER,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(creator_id) REFERENCES users(id)
    );

create TABLE
    likes_dislikes (
        user_id TEXT,
        post_id text,
        like INTEGER
        -- FOREIGN KEY (user_id) REFERENCES users(id),
        -- FOREIGN KEY (post_id) REFERENCES posts(id)
    );

CREATE TABLE
    post_comments (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        post_id TEXT,
        user_id TEXT,
        likes INTEGER,
        dislikes INTEGER,
        content TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES posts(id)
    )