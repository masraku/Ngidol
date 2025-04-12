import { NextResponse } from "next/server";
import { cookies } from 'next/headers'

export const runtime = "nodejs";

export async function POST() {
  try {
    // Get the cookie store
    const cookieStore = cookies();

    // Delete the token cookie
    cookieStore.delete("token");

    return NextResponse.json({ 
      success: true, 
      message: "Logout berhasil" 
    }, { 
      status: 200 
    });

  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Terjadi kesalahan saat logout" 
    }, { 
      status: 500 
    });
  }
}