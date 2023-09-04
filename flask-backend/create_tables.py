def create_tables(pool):
    conn = pool.getconn()
    cursor = conn.cursor()

    # Check if the users table exists. If not - create it.
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            date_joined TIMESTAMP
        );
    ''')

    # Check if the images table exists. If not - create it.
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS images (
            id SERIAL PRIMARY KEY,
            image_url TEXT NOT NULL,
            title VARCHAR(255),
            width INTEGER,
            height INTEGER
        );
    ''')

    # Check if the image_analyses table exists. If not - create it.
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS image_analyses (
            id SERIAL PRIMARY KEY,
            image_id INTEGER REFERENCES images(id),
            hex_color_codes JSON,
            rgb_color_codes JSON,
            frequencies JSON,
            timestamp TIMESTAMP,
            user_id INTEGER REFERENCES users(id),
            identifier VARCHAR(255)
        );
    ''')

    conn.commit()
    cursor.close()
    pool.putconn(conn)
