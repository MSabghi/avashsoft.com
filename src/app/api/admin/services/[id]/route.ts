import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
  }
  const { id } = await params;
  const service = await db.service.findUnique({ where: { id } });
  if (!service) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ service });
}

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

    const service = await db.service.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        summary: body.summary,
        description: body.description,
        points: body.points,
        duration: body.duration,
        icon: body.icon,
        category: body.category,
        thumbnail: body.thumbnail,
        order: body.order,
        published: body.published,
      },
    });

    return NextResponse.json({ service });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "غیر مجاز" }, { status: 401 });
  }
  const { id } = await params;
  await db.service.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
