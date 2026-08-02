#!/bin/bash
set -e

# ─────────────────────────────────────────────
#  Configurações
# ─────────────────────────────────────────────
REMOTE_USER="root"
REMOTE_HOST="179.198.107.199"
REMOTE_DIR="/srv/aquapay"
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"

# Cores para log
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log()  { echo -e "${CYAN}[deploy]${NC} $1"; }
ok()   { echo -e "${GREEN}[ok]${NC}    $1"; }
warn() { echo -e "${YELLOW}[warn]${NC}  $1"; }
err()  { echo -e "${RED}[erro]${NC}  $1"; exit 1; }

# ─────────────────────────────────────────────
#  Validar parâmetro
# ─────────────────────────────────────────────
if [ -z "$1" ]; then
  read -rp "$(echo -e "${CYAN}[deploy]${NC} Mensagem do commit: ")" COMMIT_MSG
  [ -z "$COMMIT_MSG" ] && err "Mensagem do commit não pode ser vazia."
else
  COMMIT_MSG="$1"
fi

echo ""
echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         AQUAPAY  DEPLOY              ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
echo ""

# ─────────────────────────────────────────────
#  1. Git: add, commit, push
# ─────────────────────────────────────────────
log "Entrando no repositório: $REPO_ROOT"
cd "$REPO_ROOT"

log "Verificando mudanças no repositório..."
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  warn "Nenhuma mudança detectada no repositório. Pulando commit."
else
  log "Adicionando todas as mudanças ao stage..."
  git add -A
  ok "git add -A concluído"

  log "Criando commit: \"$COMMIT_MSG\""
  git commit -m "$COMMIT_MSG"
  ok "Commit criado"

  log "Enviando para o repositório remoto (git push)..."
  git push
  ok "git push concluído"
fi

# ─────────────────────────────────────────────
#  2. Sincronizar arquivos com o servidor
# ─────────────────────────────────────────────
log "Sincronizando arquivos com o servidor $REMOTE_HOST..."
rsync -avz --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='frontend/node_modules' \
  --exclude='frontend/.next' \
  "$REPO_ROOT/" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"
ok "Arquivos sincronizados em ${REMOTE_DIR}"

# ─────────────────────────────────────────────
#  3. Build e deploy no servidor remoto
# ─────────────────────────────────────────────
log "Conectando ao servidor remoto e executando docker compose..."
ssh "${REMOTE_USER}@${REMOTE_HOST}" bash <<EOF
  set -e
  echo "[remoto] Entrando em ${REMOTE_DIR}"
  cd "${REMOTE_DIR}"

  echo "[remoto] Parando containers anteriores (se existirem)..."
  docker compose down --remove-orphans || true

  echo "[remoto] Fazendo build e subindo containers..."
  docker compose up --build -d

  echo "[remoto] Containers em execução:"
  docker compose ps
EOF
ok "Docker compose executado no servidor remoto"

# ─────────────────────────────────────────────
#  Concluído
# ─────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     DEPLOY CONCLUÍDO COM SUCESSO!    ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${CYAN}Servidor:${NC} http://${REMOTE_HOST}"
echo -e "  ${CYAN}Commit:${NC}   ${COMMIT_MSG}"
echo ""
