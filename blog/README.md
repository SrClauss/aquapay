# Água Pay — Blog Backend

Backend FastAPI para o blog da plataforma Água Pay.

## Tecnologias

- **Python 3.12**
- **FastAPI** — framework web
- **SQLAlchemy 2** — ORM
- **SQLite** — banco de dados (troque por PostgreSQL em produção)
- **Pydantic v2** — validação de dados

## Estrutura

```
blog/
├── main.py         # App FastAPI, rotas e middleware
├── models.py       # Modelos SQLAlchemy
├── schemas.py      # Schemas Pydantic
├── database.py     # Conexão e sessão do banco de dados
├── requirements.txt
└── Dockerfile
```

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Health check |
| GET | `/posts` | Lista posts (paginação + filtro por categoria) |
| GET | `/posts/{slug}` | Retorna post pelo slug |
| GET | `/categories` | Lista categorias com contagem |
| POST | `/posts` | Cria novo post |
| PUT | `/posts/{slug}` | Atualiza post existente |
| DELETE | `/posts/{slug}` | Remove post |

### Parâmetros de listagem (`GET /posts`)

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `page` | int | 1 | Número da página |
| `per_page` | int | 10 | Posts por página (máx. 100) |
| `category` | string | — | Filtrar por categoria |

## Executar localmente

```bash
cd blog
pip install -r requirements.txt
uvicorn main:app --reload
```

A API estará disponível em `http://localhost:8000`.

Documentação automática:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Executar com Docker Compose

Na raiz do projeto:

```bash
docker compose up --build
```

A API fica disponível em `http://localhost/api/blog/` (proxied pelo Nginx).

## Integração com o frontend

O frontend Next.js consome esta API em `/api/blog/posts`. Em produção, o Nginx
faz o proxy de `/api/blog/` → `http://blog:8000/`.
