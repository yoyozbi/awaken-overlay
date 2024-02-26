import prisma from '@prisma/client';
import chalk from 'chalk';
import { execSync } from 'child_process';

let err = false;

function success(msg) {
	console.log(chalk.greenBright(`✓ ${msg}`));
}
function errorLog(msg) {
	console.error(chalk.redBright(`✗ ${msg}`));
}

console.log(chalk.green('Checking database connection...'));
const db = new prisma.PrismaClient();
async function main() {
	try {
		await db.$connect();
		success('Database connection established.');

		console.log(chalk.green('Checking database migration status...'));
		execSync('npx prisma migrate deploy', { stdio: 'inherit' });
	} catch (error) {
		errorLog('Database connection failed.');
		console.error(error);
		err = true;
	} finally {
		await db.$disconnect();
		if (err) process.exit(1);
	}
}
main();
