import { recursiveQuery, test } from "@/functions/db/test";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const subjects = await test();
    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Error fetching professors:", error);
    return NextResponse.json(
      { error: "Failed to fetch professors" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {

    const resp = await recursiveQuery(10);
    return NextResponse.json(resp);
  } catch (error) {
    console.error("Error fetching test:", error);
    return NextResponse.json(
      { error: "Failed to fetch professors" },
      { status: 500 }
    );
  }
}
