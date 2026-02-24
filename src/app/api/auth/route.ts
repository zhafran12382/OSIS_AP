import { NextResponse } from "next/server";

const ADMIN_USER = "AdminNFBS";
const ADMIN_PASS = "admin";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", "authenticated", {
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
