import { NextResponse, type NextRequest } from "next/server";
import { getImagerySpin } from "@/lib/api/queries";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const modelId = sp.get("modelId");
  const paintId = sp.get("paintId") || undefined;
  const paintDescription = sp.get("paintDescription") || undefined;
  if (!modelId) {
    return NextResponse.json({ message: "modelId gerekli." }, { status: 400 });
  }
  try {
    const data = await getImagerySpin(modelId, paintId, paintDescription);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ modelId, frames: [] });
  }
}
