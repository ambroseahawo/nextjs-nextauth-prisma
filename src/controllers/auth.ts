import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { hashPassword, verifyPassword } from "../utils/auth";
import { signInSchema, signupSchema } from "../validators/auth";
import { createSession } from "./sessions";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get request body
    const { email, username, password } = req.body;

    // Validate request body
    const { error } = signupSchema.validate({ email, username, password });
    if (error) {
      res.status(422).json({ error: error.details[0].message });
      return;
    }

    // Check if the user already exists by email or username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      res.status(409).json({ error: "Email or username already registered" }); // 409 Conflict
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Register the new user
    const newUser = await prisma.user.create({ data: { email, username, password: hashedPassword } });

    // Remove password from the response
    const { password: _removedPassword, ...userData } = newUser;

    // Respond with user data and success message
    res.status(201).json({ user: userData, message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    // get request body
    const { email0rUsername, password } = req.body;
    // validate request body
    const { error } = signInSchema.validate({ email0rUsername, password });
    if (error) {
      res.status(422).json({ error: error.details[0].message });
      return;
    }

    // confirm existing user by either username and email
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: email0rUsername }, { username: email0rUsername }] },
    });
    if (!existingUser) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    // verify password
    const isPasswordValid = await verifyPassword(existingUser.password, password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // create session
    await createSession(existingUser.id, res);

    // login user, return user data
    const { password: userPassword, ...userData } = existingUser;
    res.status(200).json({ user: userData, message: "Login successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// https://chatgpt.com/c/670e8811-c8d8-8007-a4e9-531cbf047e65
