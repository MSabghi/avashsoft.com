import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/settings";

// GET /api/admin/products - لیست محصولات
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
  }

  const products = await db.product.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ products });
}

// POST /api/admin/products - ایجاد محصول جدید
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const slug = body.slug || slugify(body.title);

    // اطمینان از یکتایی slug
    const existing = await db.product.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const product = await db.product.create({
      data: {
        slug: finalSlug,
        title: body.title,
        summary: body.summary || "",
        description: body.description || "",
        features: body.features || "",
        audience: body.audience || "",
        icon: body.icon || "finance",
        category: body.category || "نرم‌افزار مالی",
        thumbnail: body.thumbnail || null,
        order: body.order || 0,
        published: body.published !== false,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
