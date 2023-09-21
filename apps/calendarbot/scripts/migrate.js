require("dotenv").config();


const pg = require("pg");
const { drizzle } = require("drizzle-orm/node-postgres");
const { migrate } = require("drizzle-orm/node-postgres/migrator");

async function main() {
	const postgresUrl = process.env.POSTGRES_URL;
	if (!postgresUrl) {
		console.error("No POSTGRES_URL found");
		return;
	}
	const client = new pg.Client({ connectionString: postgresUrl });

	const db = drizzle(client);
	await migrate(db, { migrationsFolder: './drizzle' });

}

main().catch(console.error)
