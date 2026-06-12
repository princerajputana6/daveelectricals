import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { createSession, isAdminEmail, validEmail } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 },
      );
    }
    if (!email || !validEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }
    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const db = await getDb();
    const users = db.collection("users");
    await users.createIndex({ email: 1 }, { unique: true });

    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await users.insertOne({
      _id: new ObjectId(),
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date(),
    });

    await createSession({
      uid: result.insertedId.toString(),
      email: email.toLowerCase(),
      name: name.trim(),
    });

    return NextResponse.json({
      ok: true,
      user: { name: name.trim(), email: email.toLowerCase() },
      isAdmin: isAdminEmail(email),
    });
  } catch (err) {
    console.error("[signup] error", err);
    return NextResponse.json(
      { error: "Could not create your account. Please try again." },
      { status: 500 },
    );
  }
}
