import { hashPassword, verifyPassword } from "@/utils/auth";
import { signInSchema, signupSchema } from "@/validators/auth";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { createSession } from "./sessions";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  try {
    // get request body
    const { email, username, password } = req.body;
    // validate request body
    const { error } = signupSchema.validate({ email, username, password });
    if (error) return res.status(422).json({ error: error.details[0].message });

    // confirm existing user by either username and email
    const existingUser = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existingUser) return res.status(401).json({ error: "Email or username already registered" });

    // hash password
    const hashedPassword = await hashPassword(password);
    // register new user
    const newUser = await prisma.user.create({ data: { email, username, password: hashedPassword } });
    const { password: newUserPassword, ...userData } = newUser;

    return res.status(201).json({ user: userData, message: "Signup successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    // get request body
    const { email0rUsername, password } = req.body;
    // validate request body
    const { error } = signInSchema.validate({ email0rUsername, password });
    if (error) return res.status(422).json({ error: error.details[0].message });

    // confirm existing user by either username and email
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: email0rUsername }, { username: email0rUsername }] },
    });
    if (!existingUser) return res.status(400).json({ error: "Invalid credentials" });

    // verify password
    const isPasswordValid = await verifyPassword(existingUser.password, password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create session
    await createSession(existingUser.id, res);

    // login user, return user data
    const { password: userPassword, ...userData } = existingUser;
    return res.status(200).json({ user: userData, message: "Login successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// https://chatgpt.com/c/670e8811-c8d8-8007-a4e9-531cbf047e65
