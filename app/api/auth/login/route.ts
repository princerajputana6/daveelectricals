import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { createSession, isAdminEmail, validEmail } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !validEmail(email) || !password) {
      return NextResponse.json(
        { error: "Please enter a valid email and password." },
        { status: 400 },
      );
    }

    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    await createSession({
      uid: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({
      ok: true,
      user: { name: user.name, email: user.email },
      isAdmin: isAdminEmail(user.email),
    });
  } catch (err) {
    console.error("[login] error", err);
    return NextResponse.json(
      { error: "Could not sign you in. Please try again." },
      { status: 500 },
    );
  }
}
