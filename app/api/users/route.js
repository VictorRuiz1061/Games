import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET () {
    const user = await prisma.users.findMany();
    return NextResponse.json(user)
}

export async function POST(request) {
        const json = await request.json();
        const user = await prisma.users.create(
        {
            data: json
        }
    );
    return NextResponse.json(user)
}
