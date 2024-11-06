import { NextResponse } from "next/server";

import { userRole } from "@prisma/client";

import { currentRole } from "@/lib/auth";

export async function GET() {
  const role = await currentRole();

  if (role === userRole.ADMIN) {
    return new NextResponse(null, { status: 200 });
  }

  return new NextResponse(null, { status: 403 });
}
