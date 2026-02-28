import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTeacherId } from '@/lib/auth';

export async function GET() {
    const teacherId = await getTeacherId();
    if (!teacherId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const students = await prisma.student.findMany({
            where: { teacherId },
            orderBy: { createdAt: 'asc' },
        });
        return NextResponse.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const teacherId = await getTeacherId();
    if (!teacherId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name } = await request.json();
        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }
        const student = await prisma.student.create({
            data: { name, teacherId },
        });
        return NextResponse.json(student, { status: 201 });
    } catch (error) {
        console.error('Error creating student:', error);
        return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
    }
}
