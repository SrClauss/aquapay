# Água Pay — Roadmap de Implementação

---

## FASE 1 — Backend: Auth + Usuários
- [x] 1.1 Modelo `User` (email, hashed_password, is_admin)
- [x] 1.2 Endpoints `POST /auth/login`, `GET /auth/me`
- [x] 1.3 Dependência `get_current_admin` com JWT
- [x] 1.4 `POST /users`, `GET /users`, `DELETE /users/{id}`
- [x] 1.5 Script de seed: criar primeiro admin via variável de ambiente
- [x] 1.6 Testes automatizados para auth e usuários

## FASE 2 — Backend: Leads
- [x] 2.1 Modelo `Lead` (name, email, phone, message, source, read)
- [x] 2.2 `POST /leads` (público)
- [x] 2.3 `GET /leads` (admin)
- [x] 2.4 `PATCH /leads/{id}/read`

## FASE 3 — Backend: Post CRUD admin
- [x] 3.1 Adicionar campo `hero_image_url` ao modelo `Post`
- [x] 3.2 `POST /posts`, `PUT /posts/{slug}`, `DELETE /posts/{slug}` (requer JWT)

## FASE 4 — MinIO no docker-compose
- [x] 4.1 Serviço `minio` no `docker-compose.yml`
- [x] 4.2 Script de init que cria o bucket `aquapay-media` com política pública
- [x] 4.3 Rota `/media/` no nginx apontando para MinIO

## FASE 5 — Backend: Upload de imagem
- [x] 5.1 `POST /upload/image` (requer JWT) → salva no MinIO, retorna URL

## FASE 6 — Landing page: novas seções
- [x] 6.1 Seção "Sobre o Água Pay" (4 cards com os textos do WhatsApp)
- [x] 6.2 Seção "Fale Conosco" (WhatsApp + Instagram)
- [x] 6.3 Seção "Envie uma Mensagem" (form → `POST /leads`)

## FASE 7 — Admin: layout + login
- [x] 7.1 `app/admin/layout.tsx` com guarda de rota JWT
- [x] 7.2 `app/admin/login/page.tsx`
- [x] 7.3 Utilitário de token no localStorage

## FASE 8 — Admin: dashboard + leads
- [x] 8.1 `app/admin/dashboard/page.tsx` (resumo: posts, leads, não lidos)
- [x] 8.2 `app/admin/leads/page.tsx` (tabela + marcar como lido)

## FASE 9 — Admin: posts + editor
- [x] 9.1 `app/admin/posts/page.tsx` (listagem)
- [x] 9.2 `app/admin/posts/new/page.tsx` (TipTap + upload hero)
- [x] 9.3 `app/admin/posts/[slug]/page.tsx` (editar)

## FASE 10 — Blog: hero image + render HTML
- [x] 10.1 Cards do blog exibem imagem hero
- [x] 10.2 Página do post renderiza HTML com DOMPurify

## FASE 11 — Deploy
- [x] 11.1 Variáveis de ambiente de produção (SECRET_KEY, MINIO_*, ADMIN_EMAIL)
- [x] 11.2 `deploy.sh` atualizado para incluir MinIO
