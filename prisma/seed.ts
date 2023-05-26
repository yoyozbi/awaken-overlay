import {PrismaClient} from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()
async function main() {
    console.log("Start seeding ...");
    if(process.env.ADMIN_PASSWORD) {
    await prisma.user.create({
        data: {
            username: "admin",
            password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
            isAdmin: true,
        }});
    const solid = await prisma.team.create({
        data: {
            name: "Solid", 
            icon: ""
        },
        
    });
    const aopik = await prisma.team.create({
        data: {
            name: "Aopik",
            icon: ""
        }
    });
    await prisma.team.createMany({
        data: [
            {name: "Phoenix", icon: ""},
            {name: "Dive Esport", icon: ""},
            {name: "Scythe of Seraph", icon: ""},
            {name: "Irie legacy", icon: ""},
        ]
    })
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
    })
    }else {
        console.error("ADMIN_PASSWORD not set");
    }
    console.log("Seeding finished.");
}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})