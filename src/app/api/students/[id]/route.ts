import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTeacherId } from '@/lib/auth';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const teacherId = await getTeacherId();
    if (!teacherId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId, 10);
        const { name } = await request.json();

        if (isNaN(id) || !name) {
            return NextResponse.json(
                { error: 'Invalid ID or Name' },
                { status: 400 }
            );
        }

        const student = await prisma.student.findFirst({ where: { id, teacherId } });
        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        const updatedStudent = await prisma.student.update({
            where: { id },
            data: { name },
        });

        return NextResponse.json(updatedStudent);
    } catch (error) {
        console.error('Error updating student:', error);
        return NextResponse.json(
            { error: 'Failed to update student' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const teacherId = await getTeacherId();
    if (!teacherId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId, 10);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const student = await prisma.student.findFirst({ where: { id, teacherId } });
        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        await prisma.student.delete({ where: { id } });

        return NextResponse.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        return NextResponse.json(
            { error: 'Failed to delete student' },
            { status: 500 }
        );
    }
}
