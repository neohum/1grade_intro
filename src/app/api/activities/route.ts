import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTeacherId } from '@/lib/auth';

export async function GET() {
    const teacherId = await getTeacherId();
    if (!teacherId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const activities = await prisma.activity.findMany({
            where: { teacherId },
            orderBy: { createdAt: 'asc' },
        });
        return NextResponse.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch activities' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const teacherId = await getTeacherId();
    if (!teacherId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { title, iconUrl } = await request.json();

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const activity = await prisma.activity.create({
            data: {
                title,
                iconUrl: iconUrl || null,
                teacherId,
            },
        });

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error('Error creating activity:', error);
        return NextResponse.json(
            { error: 'Failed to create activity' },
            { status: 500 }
        );
    }
}
