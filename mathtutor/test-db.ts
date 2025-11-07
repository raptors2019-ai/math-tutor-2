// test-db.ts
import { prisma } from "@/lib/prisma";

async function testConnection() {
  try {
    const count = await prisma.user.count(); // Or any simple query from your schema
    console.log("Connection successful! User count:", count);
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

testConnection();
