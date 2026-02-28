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
        const { title, iconUrl } = await request.json();

        if (isNaN(id) || !title) {
            return NextResponse.json(
                { error: 'Invalid ID or Title' },
                { status: 400 }
            );
        }

        const activity = await prisma.activity.findFirst({ where: { id, teacherId } });
        if (!activity) {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }

        const updatedActivity = await prisma.activity.update({
            where: { id },
            data: {
                title,
                iconUrl: iconUrl || null,
            },
        });

        return NextResponse.json(updatedActivity);
    } catch (error) {
        console.error('Error updating activity:', error);
        return NextResponse.json(
            { error: 'Failed to update activity' },
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

        const activity = await prisma.activity.findFirst({ where: { id, teacherId } });
        if (!activity) {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }

        await prisma.activity.delete({ where: { id } });

        return NextResponse.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('Error deleting activity:', error);
        return NextResponse.json(
            { error: 'Failed to delete activity' },
            { status: 500 }
        );
    }
}
