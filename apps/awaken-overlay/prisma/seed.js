import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
	console.log('Start seeding ...');
	let solid = await db.team.findFirst({ where: { name: 'Solid' } });
	if (!solid) {
		solid = await db.team.create({
			data: {
				name: 'Solid',
				leftIcon: '',
				rightIcon: ''
			}
		});
	}
	let aopik = await db.team.findFirst({ where: { name: 'Aopik' } });
	if (!aopik) {
		aopik = await db.team.create({
			data: {
				name: 'Aopik',
				leftIcon: '',
				rightIcon: ''
			}
		});

		await db.team.createMany({
			data: [
				{ name: 'Phoenix', leftIcon: '', rightIcon: '' },
				{ name: 'Dive Esport', leftIcon: '', rightIcon: '' },
				{ name: 'Scythe of Seraph', leftIcon: '', rightIcon: '' },
				{ name: 'Irie legacy', leftIcon: '', rightIcon: '' }
			]
		});
		await db.currentMatch.create({
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
	}
}

main()
	.then(async () => {
		await db.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await db.$disconnect();
		process.exit(1);
	});
