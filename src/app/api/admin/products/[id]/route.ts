import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/products/[id] - دریافت یک محصول
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
  }

  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

// PUT /api/admin/products/[id] - به‌روزرسانی محصول
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const product = await db.product.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        summary: body.summary,
        description: body.description,
        features: body.features,
        audience: body.audience,
        icon: body.icon,
        category: body.category,
        thumbnail: body.thumbnail,
        order: body.order,
        published: body.published,
      },
    });

    return NextResponse.json({ product });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id] - حذف محصول
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
  }

  const { id } = await params;
  await db.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
