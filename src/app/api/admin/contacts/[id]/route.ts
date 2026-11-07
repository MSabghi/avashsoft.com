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
  const contact = await db.contactSubmission.findUnique({ where: { id } });
  if (!contact) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ contact });
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

    const contact = await db.contactSubmission.update({
      where: { id },
      data: {
        status: body.status,
        handledBy: body.status !== "new" ? session.user?.id : undefined,
      },
    });

    return NextResponse.json({ contact });
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
  await db.contactSubmission.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
