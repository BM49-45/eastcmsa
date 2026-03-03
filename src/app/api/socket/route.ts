// src/app/api/socket/route.ts
import { NextRequest } from "next/server";
import { initSocket } from "@/server/socket";

export const GET = async (req: NextRequest) => {
  return new Response("Socket route works");
};

// Only needed if you want to attach socket to the Next.js server
export const POST = async (req: NextRequest) => {
  // Next.js already has a running server, we can init socket on it
  const res = new Response("OK");
  const server = res as any; // Hacky, but in App Router you need edge support or custom server
  initSocket(server);
  return res;
};