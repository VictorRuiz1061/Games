import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const id = params.id;

        const categories = await prisma.categories.findUnique({
            where: { id: parseInt(id) }
        });
        return NextResponse.json(categories);
}

export async function PUT(request, { params }) {
    const id = params.id;
        const json = await request.json();
        const categories = await prisma.categories.update({
            where: { id: parseInt(id) },
            data: {
                name: json.name
            }
        });
        return NextResponse.json(categories);
}

export async function DELETE(request, { params }) {
    const id = params.id;

        await prisma.categories.delete({
            where: { id: parseInt(id) }
        });
    return NextResponse.json("categories eliminado correctamente");
}
