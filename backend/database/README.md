# Phase 3: MySQL database setup

This folder contains the schema and sample data for the NUDU skincare store. The SQL files have **not** been applied to a database in this workspace. They create the schema when you run them against your own MySQL server.

The backend does not yet connect to MySQL. Database connection code and the `mysql2` package are planned for Phase 4. React will continue to access data through a backend API; it should never connect to MySQL directly.

## 1. Check that MySQL is installed and running

Open PowerShell and check for the MySQL command-line client:

```powershell
mysql --version
```

On Windows, check for a MySQL service and whether the default port is listening:

```powershell
Get-Service *MySQL*
Test-NetConnection localhost -Port 3306
```

The service may have a name such as `MySQL80`. If it is installed but stopped, start that service from an Administrator PowerShell window:

```powershell
Start-Service MySQL80
```

Use the service name shown on your computer. On macOS or Linux, check the service with `brew services list` or `systemctl status mysql`, depending on how MySQL was installed.

## 2. Create the database and tables

The `schema.sql` file creates the `skincare_store` database if it does not exist, selects it, and creates all five tables. You do not need to create the database separately.

Open **Command Prompt (`cmd.exe`)** in the project root (the folder containing `backend` and `frontend`). Replace `YOUR_MYSQL_USERNAME` with your own MySQL username. The `-p` option prompts for your password; enter it at the prompt. Do not put a real password in the command.

```bat
mysql --host=localhost --port=3306 --user=YOUR_MYSQL_USERNAME -p < backend\database\schema.sql
```

If you prefer MySQL Workbench, open `schema.sql` in Workbench after connecting to your local MySQL server, then execute the script.

## 3. Add the sample categories and products

After the schema command succeeds, run this from the same project-root Command Prompt. Enter your MySQL password when prompted:

```bat
mysql --host=localhost --port=3306 --user=YOUR_MYSQL_USERNAME -p < backend\database\seed.sql
```

The seed file adds four categories and eight sample products. It can be run more than once without creating duplicate rows for the same names and slugs. Product images are illustrative stock-photo URLs; product descriptions make no medical or treatment claims.

## 4. Verify tables and sample data

Connect using your own username and the password prompt:

```text
mysql --host=localhost --port=3306 --user=YOUR_MYSQL_USERNAME -p
```

At the `mysql>` prompt, run:

```sql
USE skincare_store;
SHOW TABLES;

SELECT COUNT(*) AS category_count FROM categories;
SELECT COUNT(*) AS product_count FROM products;

SELECT categories.name AS category, products.name AS product,
       products.price, products.stock_quantity
FROM products
JOIN categories ON categories.id = products.category_id
ORDER BY categories.name, products.name;
```

You should see the tables `categories`, `products`, `users`, `orders`, and `order_items`, plus 4 categories and 8 sample products.

## 5. Configure the backend environment

From the project root, copy the example file and edit the copy:

```powershell
Copy-Item backend\.env.example backend\.env
notepad backend\.env
```

Replace the example database username and password with credentials from your own MySQL setup. Keep the actual `.env` file local; the repository `.gitignore` already excludes `.env` files. The example file contains placeholders only. The frontend does not receive database credentials.

The current example frontend origin uses port `5174`, matching this local storefront setup. Change `FRONTEND_ORIGIN` only if Vite is running on a different origin.

## 6. Common connection errors

- **Access denied**: Check the MySQL username and password, and confirm that this MySQL account can connect from `localhost`. Re-enter the password when prompted; do not add it to the command line.
- **Connection refused / Can't connect**: MySQL may be stopped, listening on a different port, or configured for a different host. Check the MySQL service and the configured port (default `3306`).
- **Unknown database `skincare_store`**: Run `schema.sql` first. It creates the database before creating the tables.
- **Duplicate entry**: The schema's unique keys protect names, emails, and slugs. The seed statements are safe to rerun for the sample slugs; do not change those slugs to values already in use.

## Phase 4 note

The existing backend package does not include a MySQL driver. Install a compatible `mysql2` package in Phase 4 when the backend database connection is implemented. No database routes or frontend database connections are part of Phase 3.
