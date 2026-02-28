-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- Insert a default teacher for existing data (bcrypt hash of "changeme")
INSERT INTO "Teacher" ("email", "password", "name", "updatedAt")
VALUES ('admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '기본 선생님', NOW());

-- AlterTable: add teacherId columns with default pointing to the new teacher
ALTER TABLE "Student" ADD COLUMN "teacherId" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Activity" ADD COLUMN "teacherId" INTEGER NOT NULL DEFAULT 1;

-- Remove the defaults so future inserts must specify teacherId
ALTER TABLE "Student" ALTER COLUMN "teacherId" DROP DEFAULT;
ALTER TABLE "Activity" ALTER COLUMN "teacherId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
