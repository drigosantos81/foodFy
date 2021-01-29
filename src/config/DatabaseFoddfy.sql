/* Passo 1: Criar o Banco de Dados Foodfy */
CREATE DATABASE foodfy

/* Passo 2: Criar as tabelas com seus respectivos relacionamentos */
CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "file_id" int,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chef_id" int,
  "user_id" int,
  "title" text NOT NULL,
  "ingredients" text[] NOT NULL,
  "preparation" text[] NOT NULL,
  "information" text NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "files" (
  "id" int PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" int PRIMARY KEY,
  "recipe_id" int,
  "file_id" int
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
  "is_admin" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

/* Passo 3: Criar os relacionamentos das tabelas */
ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON UPDATE CASCADE;

ALTER TABLE "recipes" ADD COLUMN "user_id" INTEGER REFERENCES "users" ("id") ON UPDATE CASCADE;

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") ON DELETE CASCADE;

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE CASCADE;

/* Passo 4: Criar Procedure para atualização automática do campo "updated_at" */
/* Passo 4.1 ==== CRIAÇÃO DA PROCEDURE ==== */
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$function$

/* Passo 5: Aplicar a Trigger nas tabelas seleionadas */
/* ==== CONFIGURAÇÃO DA TRIGGER  ==== */
/* Trigger para tabela recipes */

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

/* Trigger para tabela chefs */
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

/* ==== TABELA PARA CONTROLE DA SESSÃO DO USUÁRIO */
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;