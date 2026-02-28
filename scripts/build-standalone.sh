#!/bin/bash
set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DIST_DIR="$PROJECT_DIR/dist"
STANDALONE_DIR="$DIST_DIR/1grade-app"

echo "=== 스스로 척척 - 독립 실행 패키지 빌드 ==="

# 1. Clean
rm -rf "$DIST_DIR"
mkdir -p "$STANDALONE_DIR"

# 2. Next.js standalone build
echo "[1/4] Next.js 빌드 중..."
cd "$PROJECT_DIR"
npx next build

# 3. Copy standalone output
echo "[2/4] 파일 복사 중..."
cp -r .next/standalone/* "$STANDALONE_DIR/"
mkdir -p "$STANDALONE_DIR/.next"
cp -r .next/static "$STANDALONE_DIR/.next/static"
if [ -d "public" ]; then
  cp -r public "$STANDALONE_DIR/public"
fi
cp .env "$STANDALONE_DIR/.env" 2>/dev/null || true
cp -r prisma "$STANDALONE_DIR/prisma"

# 4. Create launcher scripts
echo "[3/4] 런처 생성 중..."

# Windows launcher
cat > "$STANDALONE_DIR/start.bat" << 'BATCH'
@echo off
chcp 65001 >nul
title 스스로 척척 - 등교 루틴
echo.
echo  ========================================
echo    스스로 척척! 등교 루틴 서버 시작
echo  ========================================
echo.
echo  서버를 시작합니다...
echo  브라우저에서 http://localhost:3000 을 열어주세요.
echo  종료하려면 이 창을 닫으세요.
echo.

where bun >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo  [bun으로 실행]
    bun server.js
) else (
    where node >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        echo  [node로 실행]
        node server.js
    ) else (
        echo  오류: bun 또는 node가 설치되어 있지 않습니다.
        echo  https://bun.sh 에서 bun을 설치해주세요.
        pause
    )
)
BATCH

# Mac/Linux launcher
cat > "$STANDALONE_DIR/start.sh" << 'SHELL'
#!/bin/bash
cd "$(dirname "$0")"
echo ""
echo "  ========================================"
echo "    스스로 척척! 등교 루틴 서버 시작"
echo "  ========================================"
echo ""
echo "  브라우저에서 http://localhost:3000 을 열어주세요."
echo "  종료하려면 Ctrl+C를 누르세요."
echo ""

if command -v bun &> /dev/null; then
    echo "  [bun으로 실행]"
    bun server.js
elif command -v node &> /dev/null; then
    echo "  [node로 실행]"
    node server.js
else
    echo "  오류: bun 또는 node가 설치되어 있지 않습니다."
    echo "  https://bun.sh 에서 bun을 설치해주세요."
fi
SHELL
chmod +x "$STANDALONE_DIR/start.sh"

# 5. Create zip
echo "[4/4] ZIP 패키지 생성 중..."
cd "$DIST_DIR"
ZIP_NAME="1grade-app.zip"
rm -f "$ZIP_NAME"
zip -r "$ZIP_NAME" "1grade-app" -x "*/node_modules/.cache/*"

echo ""
echo "=== 빌드 완료! ==="
echo "패키지 위치: $DIST_DIR/$ZIP_NAME"
echo ""
