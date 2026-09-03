import bcrypt from "bcrypt";
import pool from "./database/database.js";
import { createAdmin } from "./database/model/adminModal.js";

const seedAdmin = async () => {
  try {
    const email = "admin@sylprin.com";
    const password = "Admin@12345";

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await createAdmin({
      email,
      passwordHash,
      role: "ADMIN"
    });

    if (admin) {
      console.log("Admin created successfully!");
      console.log("Email:", admin.email);
      console.log("Role:", admin.role);
    } else {
      console.log("Admin already exists.");
    }
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
  } finally {
    await pool.end();
  }
};

seedAdmin();