-- CreateEnum
CREATE TYPE "public"."WidgetType" AS ENUM ('WHEEL', 'PIPELINE', 'TIMER', 'POSTCARD');

-- CreateTable
CREATE TABLE "public"."widgets" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."WidgetType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "widgets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "widgets_project_id_idx" ON "public"."widgets"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "widgets_project_id_name_key" ON "public"."widgets"("project_id", "name");

-- AddForeignKey
ALTER TABLE "public"."widgets" ADD CONSTRAINT "widgets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
