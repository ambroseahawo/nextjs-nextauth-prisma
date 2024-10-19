import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();

    // check existing user by email
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email }
    });
    if(existingUserByEmail){
      return NextResponse.json({ user: null, message: "Email already registered"}, { status: 409 })
    }

    // check existing user by username
    const existingUserByUsername = await db.user.findUnique({
      where: { username: username }
    });
    if(existingUserByUsername){
      return NextResponse.json({ user: null, message: "Username already registered"}, { status: 409 })
    }

    const hashedPassword = await hash(password, 10)
    const newUser = await db.user.create({ data: { email, username, password: hashedPassword} })
    const { password: newUserPassword, ...rest } = newUser

    return NextResponse.json({ user: rest, message: "User created successfully" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}