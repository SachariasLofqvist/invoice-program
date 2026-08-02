import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.invoice.update({
    where: { id: 10 },
    data: { clerkUserID: 'user_3HMOpEHh6sBGeHdoS7WpVNj5k0j' }
  });
  console.log("Uppdateringen lyckades!", result);
}

main()
  .catch(e => console.error("Prisma stötte på ett fel:", e))
  .finally(async () => await prisma.$disconnect());