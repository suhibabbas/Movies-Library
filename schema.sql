    DROP TABLE IF EXISTS movies;
    CREATE TABLE IF NOT EXISTS movies(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        poster_path VARCHAR(255),
        overview VARCHAR(10000),
        adult BOOLEAN

    )