-- Ejecutar en Supabase → SQL Editor

create table solicitudes (
  id         uuid        default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  nombre     text        not null,
  email      text        not null,
  ciudad     text        not null,
  motivo     text        not null,
  origen     text        not null
);

-- Activar seguridad por filas
alter table solicitudes enable row level security;

-- Solo se puede insertar (nadie puede leer desde el frontend)
create policy "Permitir inserción pública"
  on solicitudes for insert
  with check (true);
