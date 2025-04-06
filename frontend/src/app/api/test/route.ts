import { seedLocalDB } from "@/functions/db/test";
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const subjects = await seedLocalDB();
    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Error fetching professors:", error)
    return NextResponse.json(
      { error: "Failed to fetch professors" },
      { status: 500 }
    )
  }
}