import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}
function daysAgo(n: number): Date {
  const d = startOfDay(new Date());
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

async function main() {
  console.log("Resetting tables…");
  // Order matters because of foreign keys.
  await prisma.notification.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.habitLog.deleteMany();
  await prisma.moodLog.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.session.deleteMany();
  await prisma.student.deleteMany();
  await prisma.professional.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();

  const pw = hashPassword("demo123");

  console.log("Seeding users…");
  const admin = await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@campus.edu",
      passwordHash: pw,
      role: "admin",
      admin: { create: { level: "super" } },
    },
  });

  const rahman = await prisma.user.create({
    data: {
      name: "Dr. Imran Rahman",
      email: "dr.rahman@wellness.edu",
      passwordHash: pw,
      role: "professional",
      phone: "+880-1700-000001",
      professional: {
        create: {
          specialization: "Counseling Psychologist",
          licenseNo: "PSY-2291",
          bio: "Supports students with stress, anxiety, and academic burnout.",
        },
      },
    },
  });

  const park = await prisma.user.create({
    data: {
      name: "Dr. Lena Park",
      email: "dr.park@wellness.edu",
      passwordHash: pw,
      role: "professional",
      phone: "+880-1700-000002",
      professional: {
        create: {
          specialization: "Campus Physician",
          licenseNo: "MED-1043",
          bio: "General campus health, sleep, and nutrition guidance.",
        },
      },
    },
  });

  const sarah = await prisma.user.create({
    data: {
      name: "Sarah Ahmed",
      email: "sarah@std.edu",
      passwordHash: pw,
      role: "student",
      student: { create: { studentNo: "CSE-2101", department: "Computer Science", semester: 5 } },
    },
  });

  const james = await prisma.user.create({
    data: {
      name: "James Karim",
      email: "james@std.edu",
      passwordHash: pw,
      role: "student",
      student: { create: { studentNo: "EEE-2044", department: "Electrical Eng.", semester: 3 } },
    },
  });

  console.log("Seeding habits…");
  const habitNames = [
    { name: "Drink water", icon: "Droplets" },
    { name: "Exercise", icon: "Dumbbell" },
    { name: "Meditate", icon: "Brain" },
    { name: "Sleep 7h+", icon: "Moon" },
    { name: "Journal", icon: "NotebookPen" },
  ];
  const habits = [];
  for (const h of habitNames) {
    habits.push(await prisma.habit.create({ data: h }));
  }

  console.log("Seeding Sarah's mood + habit history…");
  const moods = [
    { mood: 3, stress: 3, sleep: 3, note: "Busy start to the week." },
    { mood: 4, stress: 2, sleep: 4, note: "Good study session." },
    { mood: 2, stress: 4, sleep: 2, note: "Exam pressure." },
    { mood: 3, stress: 3, sleep: 3, note: null },
    { mood: 4, stress: 2, sleep: 4, note: "Went for a run." },
    { mood: 5, stress: 1, sleep: 5, note: "Relaxed weekend." },
    { mood: 4, stress: 2, sleep: 4, note: "Feeling steady." },
  ];
  for (let i = 0; i < moods.length; i++) {
    const logDate = daysAgo(moods.length - 1 - i);
    await prisma.moodLog.create({
      data: { studentUserId: sarah.id, logDate, ...moods[i] },
    });
    // Mark a varied subset of habits complete each day.
    for (let h = 0; h < habits.length; h++) {
      if ((i + h) % 2 === 0) {
        await prisma.habitLog.create({
          data: { studentUserId: sarah.id, habitId: habits[h].id, logDate, completed: true },
        });
      }
    }
  }

  console.log("Seeding appointments…");
  await prisma.appointment.create({
    data: {
      studentUserId: sarah.id,
      professionalUserId: rahman.id,
      type: "Counseling",
      date: startOfDay(new Date()),
      time: "14:30",
      reason: "Feeling overwhelmed with coursework.",
      status: "Pending",
    },
  });
  await prisma.appointment.create({
    data: {
      studentUserId: james.id,
      professionalUserId: rahman.id,
      type: "Counseling",
      date: daysAgo(-2),
      time: "11:00",
      reason: "Sleep and focus issues.",
      status: "Approved",
    },
  });
  await prisma.appointment.create({
    data: {
      studentUserId: sarah.id,
      professionalUserId: park.id,
      type: "Medical",
      date: daysAgo(-4),
      time: "09:30",
      reason: "Recurring headaches.",
      status: "Pending",
    },
  });

  console.log("Seeding notifications…");
  await prisma.notification.createMany({
    data: [
      { studentUserId: sarah.id, message: "Your counseling request is pending approval." },
      { studentUserId: sarah.id, message: "You logged moods 7 days in a row — nice streak!" },
    ],
  });

  console.log("Seeding resources…");
  await prisma.resource.createMany({
    data: [
      {
        title: "Managing Exam Stress",
        description: "Practical techniques to stay calm and focused during exam season.",
        category: "Stress",
        url: "https://www.mind.org.uk/information-support/tips-for-everyday-living/student-life/",
      },
      {
        title: "Sleep Hygiene Basics",
        description: "Simple habits for falling asleep faster and waking up rested.",
        category: "Sleep",
        url: "https://www.sleepfoundation.org/sleep-hygiene",
      },
      {
        title: "5-Minute Breathing Exercises",
        description: "Quick guided breathing you can do between classes.",
        category: "Mindfulness",
        url: "https://www.headspace.com/meditation/breathing-exercises",
      },
      {
        title: "Campus Counseling Services",
        description: "How to book a confidential session with the campus wellness team.",
        category: "Support",
        url: null,
      },
      {
        title: "Eating Well on a Budget",
        description: "Balanced, affordable meals for busy students.",
        category: "Nutrition",
        url: "https://www.nhs.uk/live-well/eat-well/",
      },
    ],
  });

  console.log("\nSeed complete. Demo accounts (password: demo123):");
  console.table([
    { role: "admin", email: admin.email },
    { role: "professional", email: rahman.email },
    { role: "professional", email: park.email },
    { role: "student", email: sarah.email },
    { role: "student", email: james.email },
  ]);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
