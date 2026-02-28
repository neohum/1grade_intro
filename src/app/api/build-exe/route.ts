import { NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';

const PROJECT_ROOT = process.cwd();
const ZIP_PATH = path.join(PROJECT_ROOT, 'dist', '1grade-app.zip');

// GET: download existing zip if available
export async function GET() {
  try {
    const s = await stat(ZIP_PATH);
    const buffer = await readFile(ZIP_PATH);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="1grade-app.zip"',
        'Content-Length': s.size.toString(),
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: 'not_built',
        message: '빌드된 패키지가 없습니다. 터미널에서 먼저 빌드를 실행하세요: bun run build:standalone',
      },
      { status: 404 },
    );
  }
}
