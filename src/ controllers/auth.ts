import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { hashPassword } from "../utils/auth";
import { signupSchema } from "../validators/auth";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  try {
    // get request body
    const { email, username, password } = req.body;
    // validate request body
    const { error } = signupSchema.validate({ email, username, password });
    if (error) return res.status(422).json({ error: error.details[0].message });

    // confirm existing user by both username and email
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
  }
};
