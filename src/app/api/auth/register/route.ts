import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: '이름, 이메일, 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    const existing = await prisma.teacher.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: '이미 등록된 이메일입니다.' },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const teacher = await prisma.teacher.create({
      data: { email, password: hashed, name },
    });

    return NextResponse.json(
      { id: teacher.id, email: teacher.email, name: teacher.name },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering teacher:', error);
    return NextResponse.json(
      { error: '회원가입에 실패했습니다.' },
      { status: 500 }
    );
  }
}
