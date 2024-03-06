import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

/**
 *
 * @param {string} name
 * @param {CallableFunction} toExec
 * @param {CallableFunction} [exists=undefined]
 * @returns {any} the toExec return value or exists second array element (if exists)
 */
async function trySeeding(name, toExec, exists) {
  process.stdout.write(`Seeding ${name}... `);

  try {
    if (exists) {
      const ignore = await exists();
      if ((typeof ignore === 'boolean' && ignore) || (Array.isArray(ignore) && ignore[0])) {
        console.log('Exists');
        if (Array.isArray(ignore)) {
          return ignore[1];
        }
		return;
      }
    }
    const result = await toExec();
    console.log('✔️');
    return result;
  } catch (e) {
    console.log('❌');
    console.error(e);
    process.exit(1);
  }
}

async function main() {
  let bo3 = await db.bestOf.findFirst({ where: { nbOfMatch: 3 } });
  console.log('---------------BO--------------------');
  await trySeeding('bo5', async () => {
    await db.bestOf.upsert({
      where: {
        nbOfMatch: 5
      },
      create: { name: 'bo5', nbOfMatch: 5 },
      update: { name: 'bo5', nbOfMatch: 5 }
    });
  });

  await trySeeding('bo7', async () => {
    await db.bestOf.upsert({
      where: {
        nbOfMatch: 7
      },
      create: { name: 'bo7', nbOfMatch: 7 },
      update: { name: 'bo7', nbOfMatch: 7 }
    });
  });

  console.log('\n--------------Teams-------------------');
  const solid = await trySeeding(
    'Solid',
    async () => {
      return await db.team.create({
        data: {
          name: 'Solid',
          leftIcon: '',
          rightIcon: '',
        }
      });
    },
    async () => {
      let res = await db.team.findFirst({ where: { name: 'Solid' } });
      return [res !== null, res];
    }
  );

  const aopik = await trySeeding(
    'Aopik',
    () => {
      return db.team.create({
        data: {
          name: 'Aopik',
          leftIcon: '',
          rightIcon: '',
        }
      });
    },
    async () => {
      let res = await db.team.findFirst({ where: { name: 'Aopik' } });
      return [res !== null, res];
    }
  );

  await trySeeding(
    'Other teams',
    () => {
      return db.team.createMany({
        data: [
          { name: 'Phoenix', leftIcon: '', rightIcon: ''},
          { name: 'Dive Esport', leftIcon: '', rightIcon: ''},
          { name: 'Scythe of Seraph', leftIcon: '', rightIcon: ''},
          { name: 'Irie legacy', leftIcon: '', rightIcon: ''}
        ]
      });
    },
    async () => {
      let res = await db.team.findMany({
        where: {
          OR: [
            { name: 'Phoenix' },
            { name: 'Dive Esport' },
            { name: 'Scythe of Seraph' },
            { name: 'Irie legacy' }
          ]
        }
      });
      return res.length > 0;
    }
  );

  await trySeeding(
    'CurrentMatch',
    () => {
      return db.currentMatch.create({
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
          },
		  bestOf: {
			connect: {
				id: bo3.id
			}
		  }
        }
      });
    },
    async () => {
      let res = await db.currentMatch.findFirst();
      return res !== null;
    }
  );
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
