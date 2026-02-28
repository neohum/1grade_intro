import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTeacherId } from '@/lib/auth';

const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

export async function GET() {
    const teacherId = await getTeacherId();
    if (!teacherId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { start, end } = getTodayRange();

        const records = await prisma.record.findMany({
            where: {
                date: { gte: start, lte: end },
                student: { teacherId },
            },
        });
        return NextResponse.json(records);
    } catch (error) {
        console.error('Error fetching today records:', error);
        return NextResponse.json(
            { error: 'Failed to fetch today records' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const teacherId = await getTeacherId();
    if (!teacherId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { studentId, activityId, completed } = await request.json();

        if (!studentId || !activityId || typeof completed !== 'boolean') {
            return NextResponse.json(
                { error: 'Student ID, Activity ID, and completed status are required' },
                { status: 400 }
            );
        }

        // Verify student and activity belong to this teacher
        const [student, activity] = await Promise.all([
            prisma.student.findFirst({ where: { id: studentId, teacherId } }),
            prisma.activity.findFirst({ where: { id: activityId, teacherId } }),
        ]);

        if (!student || !activity) {
            return NextResponse.json({ error: 'Student or Activity not found' }, { status: 404 });
        }

        const { start, end } = getTodayRange();

        const existingRecord = await prisma.record.findFirst({
            where: {
                studentId,
                activityId,
                date: { gte: start, lte: end },
            },
        });

        let record;
        if (existingRecord) {
            record = await prisma.record.update({
                where: { id: existingRecord.id },
                data: { completed },
            });
        } else {
            record = await prisma.record.create({
                data: { studentId, activityId, completed },
            });
        }

        return NextResponse.json(record);
    } catch (error) {
        console.error('Error saving record:', error);
        return NextResponse.json(
            { error: 'Failed to save record' },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    const teacherId = await getTeacherId();
    if (!teacherId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { start, end } = getTodayRange();

        await prisma.record.deleteMany({
            where: {
                date: { gte: start, lte: end },
                student: { teacherId },
            },
        });

        return NextResponse.json({ message: "Today's records cleared successfully" });
    } catch (error) {
        console.error('Error clearing today records:', error);
        return NextResponse.json(
            { error: 'Failed to clear today records' },
            { status: 500 }
        );
    }
}
