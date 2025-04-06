import { recursiveQuery, test } from "@/functions/db/test"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const resp = await recursiveQuery()
    return NextResponse.json(resp)
  } catch (error) {
    console.error("Error fetching test:", error)
    return NextResponse.json(
      { error: "Failed to fetch professors" },
      { status: 500 }
    )
  } 
}