-- CreateTable
CREATE TABLE "wheel_of_fortune_spins" (
    "id" TEXT NOT NULL,
    "widget_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "sector_id" TEXT NOT NULL,
    "is_win" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wheel_of_fortune_spins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wheel_of_fortune_widgets" (
    "widget_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wheel_of_fortune_widgets_pkey" PRIMARY KEY ("widget_id")
);

-- CreateIndex
CREATE INDEX "wheel_of_fortune_spins_session_id_idx" ON "wheel_of_fortune_spins"("session_id");

-- CreateIndex
CREATE INDEX "wheel_of_fortune_spins_widget_id_idx" ON "wheel_of_fortune_spins"("widget_id");

-- CreateIndex
CREATE UNIQUE INDEX "wheel_of_fortune_spins_widget_id_session_id_key" ON "wheel_of_fortune_spins"("widget_id", "session_id");

-- AddForeignKey
ALTER TABLE "wheel_of_fortune_spins" ADD CONSTRAINT "wheel_of_fortune_spins_widget_id_fkey" FOREIGN KEY ("widget_id") REFERENCES "wheel_of_fortune_widgets"("widget_id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "wheel_of_fortune_widgets" ("widget_id")
SELECT "id"
FROM "widgets"
WHERE "type" = 'WHEEL_OF_FORTUNE'
ON CONFLICT ("widget_id") DO NOTHING;

CREATE OR REPLACE FUNCTION "guard_wheel_of_fortune_widgets"()
RETURNS trigger AS $$
DECLARE
  widget_type "WidgetType";
BEGIN
  SELECT "type"
  INTO widget_type
  FROM "widgets"
  WHERE "id" = NEW."widget_id";

  IF widget_type IS NULL THEN
    RAISE EXCEPTION 'wheel_of_fortune_widgets.widget_id % does not exist in widgets', NEW."widget_id";
  END IF;

  IF widget_type <> 'WHEEL_OF_FORTUNE'::"WidgetType" THEN
    RAISE EXCEPTION 'widget % is not WHEEL_OF_FORTUNE', NEW."widget_id";
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "wheel_of_fortune_widgets_guard_trigger" ON "wheel_of_fortune_widgets";
CREATE TRIGGER "wheel_of_fortune_widgets_guard_trigger"
BEFORE INSERT OR UPDATE ON "wheel_of_fortune_widgets"
FOR EACH ROW EXECUTE FUNCTION "guard_wheel_of_fortune_widgets"();

CREATE OR REPLACE FUNCTION "sync_wheel_of_fortune_widget_row"()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM "wheel_of_fortune_widgets"
    WHERE "widget_id" = OLD."id";
    RETURN OLD;
  END IF;

  IF NEW."type" = 'WHEEL_OF_FORTUNE'::"WidgetType" THEN
    INSERT INTO "wheel_of_fortune_widgets" ("widget_id")
    VALUES (NEW."id")
    ON CONFLICT ("widget_id") DO NOTHING;
  ELSE
    DELETE FROM "wheel_of_fortune_widgets"
    WHERE "widget_id" = NEW."id";
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "widgets_sync_wheel_of_fortune_widget_trigger" ON "widgets";
CREATE TRIGGER "widgets_sync_wheel_of_fortune_widget_trigger"
AFTER INSERT OR UPDATE OF "type" ON "widgets"
FOR EACH ROW EXECUTE FUNCTION "sync_wheel_of_fortune_widget_row"();

DROP TRIGGER IF EXISTS "widgets_sync_wheel_of_fortune_widget_on_delete_trigger" ON "widgets";
CREATE TRIGGER "widgets_sync_wheel_of_fortune_widget_on_delete_trigger"
AFTER DELETE ON "widgets"
FOR EACH ROW EXECUTE FUNCTION "sync_wheel_of_fortune_widget_row"();
