import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/settings";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
  }
  const services = await db.service.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const slug = body.slug || slugify(body.title);

    const existing = await db.service.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const service = await db.service.create({
      data: {
        slug: finalSlug,
        title: body.title,
        summary: body.summary || "",
        description: body.description || "",
        points: body.points || "",
        duration: body.duration || "",
        icon: body.icon || "rocket",
        category: body.category || "خدمت",
        thumbnail: body.thumbnail || null,
        order: body.order || 0,
        published: body.published !== false,
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
