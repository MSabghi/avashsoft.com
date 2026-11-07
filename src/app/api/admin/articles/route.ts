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
  const articles = await db.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });
  return NextResponse.json({ articles });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const slug = body.slug || slugify(body.title);

    const existing = await db.article.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const article = await db.article.create({
      data: {
        slug: finalSlug,
        title: body.title,
        excerpt: body.excerpt || "",
        content: body.content || "",
        category: body.category || "عمومی",
        tags: body.tags || "",
        thumbnail: body.thumbnail || null,
        readTime: body.readTime || 5,
        featured: body.featured || false,
        published: body.published !== false,
        authorId: session.user?.id,
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
