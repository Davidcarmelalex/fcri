import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type InquiryRecord = {
  id: string;
  type: "donation" | "partnership" | "fellowship" | "general";
  name: string;
  email: string;
  organization?: string;
  budget?: string;
  message: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "inquiries.json");

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await writeFile(DATA_FILE, "[]\n", "utf8");
  }
}

export async function saveInquiry(record: InquiryRecord) {
  await ensureStore();
  const current = JSON.parse(await readFile(DATA_FILE, "utf8")) as InquiryRecord[];
  current.unshift(record);
  await writeFile(DATA_FILE, `${JSON.stringify(current, null, 2)}\n`, "utf8");
  return record;
}

export async function listInquiries() {
  await ensureStore();
  return JSON.parse(await readFile(DATA_FILE, "utf8")) as InquiryRecord[];
}
