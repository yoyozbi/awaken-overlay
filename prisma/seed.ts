import { PrismaClient } from '@prisma/client';
import {createHash} from "crypto";
const prisma = new PrismaClient();
const hashPassword = (password: string) : string => {
	return createHash('sha256').update(password).digest('hex');
};
async function main() {
	console.log('Start seeding ...');
	if (process.env.ADMIN_PASSWORD) {
		const user = await prisma.user.findUnique({ where: { username: 'admin' } });
		if (user) {
			console.log('Admin user already exists, skipping seeding.');
			return;
		}
		await prisma.user.create({
			data: {
				username: 'admin',
				password: hashPassword(process.env.ADMIN_PASSWORD),
				isAdmin: true
			}
		});
		const solid = await prisma.team.create({
			data: {
				name: 'Solid',
				leftIcon: '',
				rightIcon: '',
			}
		});
		const aopik = await prisma.team.create({
			data: {
				name: 'Aopik',
				leftIcon: '',
				rightIcon: ''
			}
		});
		await prisma.team.createMany({
			data: [
				{ name: 'Phoenix', leftIcon: '', rightIcon: '' },
				{ name: 'Dive Esport', leftIcon: '', rightIcon: '' },
				{ name: 'Scythe of Seraph', leftIcon: '', rightIcon: '' },
				{ name: 'Irie legacy', leftIcon: '', rightIcon: '' }
			]
		});
		await prisma.currentMatch.create({
			data: {
				team1Score: 0,
				team2Score: 0,
				team1: {
					connect: {
						id: solid.id
					}
				},
				team2: {
					connect: {
						id: aopik.id
					}
				}
			}
		});
	} else {
		console.error('ADMIN_PASSWORD not set');
	}
	console.log('Seeding finished.');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
