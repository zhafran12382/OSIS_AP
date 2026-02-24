import { NextResponse } from "next/server";

const ADMIN_USER = process.env.ADMIN_USERNAME ?? "AdminNFBS";
const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? "admin";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = Buffer.from(`${Date.now()}:${ADMIN_USER}`).toString("base64");
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
