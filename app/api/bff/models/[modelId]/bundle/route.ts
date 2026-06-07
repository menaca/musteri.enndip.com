import { NextResponse, type NextRequest } from "next/server";
import { getModelBundle } from "@/lib/api/queries";
import { ApiError } from "@/lib/api/server";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ modelId: string }> },
) {
  const { modelId } = await context.params;
  try {
    const bundle = await getModelBundle(modelId);
    return NextResponse.json(bundle);
  } catch (e) {
    const status = e instanceof ApiError ? e.status || 502 : 502;
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Model verisi yüklenemedi." },
      { status },
    );
  }
}
