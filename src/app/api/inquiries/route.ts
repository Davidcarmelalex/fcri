import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { saveInquiry } from "@/lib/inquiryStore";
import { sendInquiryNotifications } from "@/lib/mailer";

const allowedTypes = new Set(["donation", "partnership", "fellowship", "general"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const type = String(body.type || "general");
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const organization = String(body.organization || "").trim();
    const budget = String(body.budget || "").trim();
    const message = String(body.message || "").trim();

    if (!allowedTypes.has(type)) {
      return NextResponse.json({ success: false, message: "Invalid inquiry type" }, { status: 400 });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: "Name, email, and message are required" }, { status: 400 });
    }

    const record = await saveInquiry({
      id: randomUUID(),
      type: type as "donation" | "partnership" | "fellowship" | "general",
      name,
      email,
      organization: organization || undefined,
      budget: budget || undefined,
      message,
      createdAt: new Date().toISOString(),
    });

    const notifications = await sendInquiryNotifications(record);

    return NextResponse.json({
      success: true,
      inquiry: record,
      notifications,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to submit inquiry" },
      { status: 500 },
    );
  }
}
