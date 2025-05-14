const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data (optional)
  await prisma.securityAgency.deleteMany();

  // List of states (36 states + FCT)
  const states = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
    'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
    'FCT'
  ];

  // Government agencies template
  const governmentAgencies = ['Police Command', 'NSCDC Command', 'FRSC Command', 'NDLEA Command'];

  // Seed government agencies for each state
  for (const state of states) {
    for (const agency of governmentAgencies) {
      await prisma.securityAgency.create({
        data: {
          state,
          type: 'Government',
          name: `${state} ${agency}`,
          phone: '08012345678', // Placeholder phone number
          address: `${state} State Headquarters`, // Placeholder address
        },
      });
    }
  }

  // Seed a few private agencies (example)
  const privateAgencies = [
    { state: 'Abia', name: 'XYZ Security Ltd. - Abia Branch', phone: '08098765432', address: '123 Umuahia Road, Abia' },
    { state: 'Lagos', name: 'ABC Security Services - Lagos Office', phone: '08055555555', address: '456 Ikeja Street, Lagos' },
    { state: 'Lagos', name: 'SecureGuard Ltd. - Lagos Branch', phone: '08011112222', address: '789 Victoria Island, Lagos' },
    { state: 'Rivers', name: 'SafeZone Security - Port Harcourt', phone: '08033334444', address: '101 PH Road, Rivers' },
  ];

  for (const agency of privateAgencies) {
    await prisma.securityAgency.create({
      data: {
        state: agency.state,
        type: 'Private',
        name: agency.name,
        phone: agency.phone,
        address: agency.address,
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });