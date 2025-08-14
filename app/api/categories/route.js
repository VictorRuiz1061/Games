import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET () {
    const categories = await prisma.categories.findMany();
    return NextResponse.json(categories)
}

export async function POST(request) {
        const json = await request.json();
        const categories = await prisma.categories.create(
        {
            data: json
        }
    );
    return NextResponse.json(categories)
}
