import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const id = params.id;

        const platforms = await prisma.platforms.findUnique({
            where: { id: parseInt(id) }
        });
        return NextResponse.json(platforms);
}


export async function PUT(request, { params }) {
    const id = params.id;
        const json = await request.json();
        const platforms = await prisma.platforms.update({
            where: { id: parseInt(id) },
            data: {
                name: json.name
            }
        });
        return NextResponse.json(platforms);
}


export async function DELETE(request, { params }) {
    const id = params.id;

        await prisma.platforms.delete({
            where: { id: parseInt(id) }
        });
    return NextResponse.json("platforms eliminado correctamente");
}

