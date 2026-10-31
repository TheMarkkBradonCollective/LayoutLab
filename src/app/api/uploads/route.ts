import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

const MAX_BYTES = 20 * 1024 * 1024;

/** POST multipart/form-data with a "file" field; stores it in the R2 bucket bound as FILES. */
export async function POST(request: Request) {
  const { env } = getCloudflareContext();
  const bucket = (env as unknown as { FILES?: R2Bucket }).FILES;
  if (!bucket) {
    return NextResponse.json({ error: "R2 bucket binding FILES is not configured" }, { status: 500 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Expected a 'file' field" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 20 MB)" }, { status: 413 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `uploads/${crypto.randomUUID()}-${safeName}`;
  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });

  return NextResponse.json({ key, size: file.size, contentType: file.type }, { status: 201 });
}

/** GET /api/uploads?key=... streams an object back from R2. */
export async function GET(request: Request) {
  const { env } = getCloudflareContext();
  const bucket = (env as unknown as { FILES?: R2Bucket }).FILES;
  const key = new URL(request.url).searchParams.get("key");
  if (!bucket || !key) return NextResponse.json({ error: "Missing key or bucket" }, { status: 400 });
  const obj = await bucket.get(key);
  if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new Response(obj.body, {
    headers: { "content-type": obj.httpMetadata?.contentType ?? "application/octet-stream" },
  });
}
