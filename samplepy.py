import sqlite3

conn = sqlite3.connect("shop.db")
cursor = conn.cursor()

product = input("Enter product name: ")

# Vulnerable SQL query
query = f"SELECT * FROM products WHERE name = '{product}'"

print("Executing query:")
print(query)

try:
    results = cursor.execute(query).fetchall()

    if results:
        for row in results:
            print(row)
    else:
        print("No products found")

except Exception as e:
    print("Database error:", e)

conn.close()