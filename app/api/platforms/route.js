import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET () {
    const platforms = await prisma.platforms.findMany();
    return NextResponse.json(platforms)
}


export async function POST(request) {
        const json = await request.json();
        const platforms = await prisma.platforms.create(
        {
            data: json
        }
    );
    return NextResponse.json(platforms)
}
