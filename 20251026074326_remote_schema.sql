create extension if not exists "postgis" with schema "public" version '3.3.7';

create type "public"."status_verifikasi" as enum ('pending', 'diterima', 'ditolak');

create sequence "public"."desa_id_seq";

create sequence "public"."kecamatan_id_seq";

create sequence "public"."sungai_id_seq";

create sequence "public"."users_id_seq";

create table "public"."desa" (
    "id" integer not null default nextval('desa_id_seq'::regclass),
    "kode_desa" character varying(15) not null,
    "nama_desa" character varying(100) not null,
    "id_kecamatan" integer not null,
    "luas" numeric,
    "geom" geometry(MultiPolygon,4326),
    "jumlah_penduduk" integer
);


create table "public"."kecamatan" (
    "id" integer not null default nextval('kecamatan_id_seq'::regclass),
    "kode_kec" character varying(10) not null,
    "nama_kecamatan" character varying(100) not null,
    "luas" numeric,
    "geom" geometry(MultiPolygon,4326)
);


create table "public"."laporan_banjir" (
    "id" bigint generated always as identity not null,
    "latitude" double precision,
    "longitude" double precision,
    "tinggi_air" text,
    "deskripsi" text,
    "foto_url" text,
    "created_at" timestamp with time zone default now(),
    "status" character varying(20) default 'aktif'::character varying,
    "verifikasi" status_verifikasi not null default 'pending'::status_verifikasi
);


create table "public"."risiko_banjir" (
    "id" bigint generated always as identity not null,
    "nama_desa" text,
    "rata_tinggi_air" numeric,
    "kategori" text,
    "jumlah_laporan" integer,
    "terakhir_diperbarui" timestamp with time zone default now()
);


create table "public"."sungai" (
    "id" integer not null default nextval('sungai_id_seq'::regclass),
    "kode_sungai" character varying(50),
    "nama_sungai" character varying(100),
    "remark" text,
    "kelas_sungai" integer,
    "tipe_sungai" integer,
    "panjang_m" double precision,
    "file_path" text not null,
    "kecamatan_id" integer
);


create table "public"."users" (
    "id" bigint not null default nextval('users_id_seq'::regclass),
    "email" character varying(255) not null,
    "password_hash" text not null,
    "created_at" timestamp with time zone default now()
);


alter sequence "public"."desa_id_seq" owned by "public"."desa"."id";

alter sequence "public"."kecamatan_id_seq" owned by "public"."kecamatan"."id";

alter sequence "public"."sungai_id_seq" owned by "public"."sungai"."id";

alter sequence "public"."users_id_seq" owned by "public"."users"."id";

CREATE UNIQUE INDEX desa_kode_desa_key ON public.desa USING btree (kode_desa);

CREATE UNIQUE INDEX desa_pkey ON public.desa USING btree (id);

CREATE INDEX idx_desa_geom ON public.desa USING gist (geom);

CREATE INDEX idx_kecamatan_geom ON public.kecamatan USING gist (geom);

CREATE UNIQUE INDEX kecamatan_kode_kec_key ON public.kecamatan USING btree (kode_kec);

CREATE UNIQUE INDEX kecamatan_pkey ON public.kecamatan USING btree (id);

CREATE UNIQUE INDEX laporan_banjir_pkey ON public.laporan_banjir USING btree (id);

CREATE UNIQUE INDEX risiko_banjir_nama_desa_key ON public.risiko_banjir USING btree (nama_desa);

CREATE UNIQUE INDEX risiko_banjir_pkey ON public.risiko_banjir USING btree (id);

CREATE UNIQUE INDEX sungai_pkey ON public.sungai USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."desa" add constraint "desa_pkey" PRIMARY KEY using index "desa_pkey";

alter table "public"."kecamatan" add constraint "kecamatan_pkey" PRIMARY KEY using index "kecamatan_pkey";

alter table "public"."laporan_banjir" add constraint "laporan_banjir_pkey" PRIMARY KEY using index "laporan_banjir_pkey";

alter table "public"."risiko_banjir" add constraint "risiko_banjir_pkey" PRIMARY KEY using index "risiko_banjir_pkey";

alter table "public"."sungai" add constraint "sungai_pkey" PRIMARY KEY using index "sungai_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."desa" add constraint "desa_id_kecamatan_fkey" FOREIGN KEY (id_kecamatan) REFERENCES kecamatan(id) ON DELETE CASCADE not valid;

alter table "public"."desa" validate constraint "desa_id_kecamatan_fkey";

alter table "public"."desa" add constraint "desa_kode_desa_key" UNIQUE using index "desa_kode_desa_key";

alter table "public"."kecamatan" add constraint "kecamatan_kode_kec_key" UNIQUE using index "kecamatan_kode_kec_key";

alter table "public"."risiko_banjir" add constraint "risiko_banjir_nama_desa_key" UNIQUE using index "risiko_banjir_nama_desa_key";

alter table "public"."sungai" add constraint "sungai_kecamatan_id_fkey" FOREIGN KEY (kecamatan_id) REFERENCES kecamatan(id) ON DELETE CASCADE not valid;

alter table "public"."sungai" validate constraint "sungai_kecamatan_id_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

set check_function_bodies = off;

create type "public"."geometry_dump" as ("path" integer[], "geom" geometry);

CREATE OR REPLACE FUNCTION public.update_risiko_banjir()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
  desa_target TEXT;
  rata NUMERIC;
  jumlah INTEGER;
  kategori_risiko TEXT;
BEGIN
  -- Cari desa berdasarkan lokasi laporan baru
  SELECT nama_desa INTO desa_target
  FROM desa
  WHERE ST_Contains(geom, ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326))
  LIMIT 1;

  -- Jika lokasi tidak masuk wilayah desa
  IF desa_target IS NULL THEN
    RAISE NOTICE 'Laporan di luar batas desa.';
    RETURN NEW;
  END IF;

  -- Hitung rata & jumlah laporan
  SELECT 
    AVG(CAST(tinggi_air AS NUMERIC)), COUNT(*)
  INTO rata, jumlah
  FROM laporan_banjir l
  WHERE l.verifikasi = 'diterima'
  AND ST_Contains(
    (SELECT geom FROM desa WHERE nama_desa = desa_target LIMIT 1),
    ST_SetSRID(ST_MakePoint(l.longitude, l.latitude), 4326)
  );

  -- Tentukan kategori risiko
  IF rata < 30 THEN
    kategori_risiko := 'Rendah';
  ELSIF rata >= 30 AND rata < 70 THEN
    kategori_risiko := 'Sedang';
  ELSE
    kategori_risiko := 'Tinggi';
  END IF;

  -- Insert/Update risiko desa
  INSERT INTO risiko_banjir (nama_desa, rata_tinggi_air, kategori, jumlah_laporan, terakhir_diperbarui)
  VALUES (desa_target, rata, kategori_risiko, jumlah, now())
  ON CONFLICT (nama_desa)
  DO UPDATE SET 
    rata_tinggi_air = EXCLUDED.rata_tinggi_air,
    kategori = EXCLUDED.kategori,
    jumlah_laporan = EXCLUDED.jumlah_laporan,
    terakhir_diperbarui = now();

  RETURN NEW;
END;$function$
;

create type "public"."valid_detail" as ("valid" boolean, "reason" character varying, "location" geometry);

CREATE TRIGGER trg_update_risiko_banjir AFTER UPDATE OF verifikasi ON public.laporan_banjir FOR EACH ROW WHEN ((new.verifikasi = 'diterima'::status_verifikasi)) EXECUTE FUNCTION update_risiko_banjir();



