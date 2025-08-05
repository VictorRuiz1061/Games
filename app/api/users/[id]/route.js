import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const id = params.id;

        const users = await prisma.users.findUnique({
            where: { id: parseInt(id) }
        });
        return NextResponse.json(users);
}


export async function PUT(request, { params }) {
    const id = params.id;
        const json = await request.json();
        const users = await prisma.users.update({
            where: { id: parseInt(id) },
            data: {
                fullname: json.fullname,
                email: json.email,
                password: json.password
            }
        });
        return NextResponse.json(users);
}


export async function DELETE(request, { params }) {
    const id = params.id;

        await prisma.users.delete({
            where: { id: parseInt(id) }
        });
    return NextResponse.json("users eliminado correctamente");
}

