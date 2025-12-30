-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('new', 'processed', 'not_processed', 'used');

-- CreateEnum
CREATE TYPE "RequestDevice" AS ENUM ('desktop', 'mobile_ios', 'mobile_android');

-- CreateTable
CREATE TABLE "requests" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "project_id" TEXT NOT NULL,
    "widget_id" TEXT NOT NULL,
    "full_name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "prizes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "status" "RequestStatus" NOT NULL DEFAULT 'new',
    "device" "RequestDevice" NOT NULL DEFAULT 'desktop',
    "url" TEXT,
    "referrer" TEXT,
    "user_agent" TEXT,
    "ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "requests_seq_key" ON "requests"("seq");

-- CreateIndex
CREATE INDEX "requests_project_id_idx" ON "requests"("project_id");

-- CreateIndex
CREATE INDEX "requests_widget_id_idx" ON "requests"("widget_id");

-- CreateIndex
CREATE INDEX "requests_status_idx" ON "requests"("status");

-- CreateIndex
CREATE INDEX "requests_created_at_idx" ON "requests"("created_at");

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_widget_id_fkey" FOREIGN KEY ("widget_id") REFERENCES "widgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

