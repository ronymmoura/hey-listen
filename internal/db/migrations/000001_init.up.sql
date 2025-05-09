CREATE TABLE "musics" (
  "id" serial PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "artist" varchar(255) NOT NULL,
  "yt_id" varchar(100) NOT NULL,
  "lyrics" text NOT NULL,

  "created_at" timestamptz NOT NULL DEFAULT (NOW()),
  "updated_at" timestamptz NULL
);

CREATE UNIQUE INDEX "idx_musics_yt_id" ON "musics" (
  "yt_id"
);

