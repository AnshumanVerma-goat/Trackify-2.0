import sqlite3

def run_migration():
    conn = sqlite3.connect('trackify.db')
    cursor = conn.cursor()

    columns_to_add = [
        ("users", "current_burnout_score", "FLOAT DEFAULT 0.0"),
        ("users", "average_fqi", "FLOAT DEFAULT 75.0"),
        ("users", "relapse_risk", "FLOAT DEFAULT 0.0"),
        ("study_sessions", "fqi", "INTEGER NULL"),
        ("study_sessions", "interruptions", "INTEGER DEFAULT 0"),
        ("study_sessions", "completed_successfully", "BOOLEAN DEFAULT 1")
    ]

    for table, column, definition in columns_to_add:
        try:
            cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition};")
            print(f"Added {column} to {table}")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print(f"Column {column} already exists in {table}")
            else:
                print(f"Failed to add {column} to {table}: {e}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    run_migration()