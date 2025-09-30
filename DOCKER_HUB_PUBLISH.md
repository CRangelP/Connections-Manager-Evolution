# 🐳 Publicar Imagem no Docker Hub

## 📋 Pré-requisitos

1. Conta no Docker Hub: https://hub.docker.com/
2. Docker instalado localmente
3. Docker Buildx (para multi-platform builds)

## 🚀 Passo a Passo

### 1. Login no Docker Hub

```bash
docker login
```

Digite seu **username** e **password** do Docker Hub.

### 2. Criar Repositório no Docker Hub (Primeira vez)

Acesse: https://hub.docker.com/repository/create

- **Name:** `connections-manager-evolution`
- **Visibility:** Public ou Private
- **Description:** Dashboard moderno para gerenciar instâncias WhatsApp via Evolution API

### 3. Build da Imagem (Single Platform)

```bash
# Build para sua plataforma local
docker build -t crangelp/connections-manager-evolution:1.5.0 .
docker build -t crangelp/connections-manager-evolution:latest .
```

### 4. Push para Docker Hub

```bash
# Push versão específica
docker push crangelp/connections-manager-evolution:1.5.0

# Push latest
docker push crangelp/connections-manager-evolution:latest
```

---

## 🌍 Build Multi-Platform (Recomendado)

Para suportar Linux, Mac M1/M2, Raspberry Pi, etc.

### 1. Criar Builder Multi-Platform

```bash
# Criar novo builder
docker buildx create --name multiplatform-builder --use

# Iniciar builder
docker buildx inspect --bootstrap
```

### 2. Build e Push Multi-Platform

```bash
# Build para AMD64 e ARM64
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t crangelp/connections-manager-evolution:1.5.0 \
  -t crangelp/connections-manager-evolution:latest \
  --push \
  .
```

**Plataformas suportadas:**
- `linux/amd64` - Servidores Linux, Windows
- `linux/arm64` - Mac M1/M2, Raspberry Pi 4/5
- `linux/arm/v7` - Raspberry Pi 3 (opcional)

---

## 📦 Testando a Imagem Publicada

### Testar Pull

```bash
docker pull crangelp/connections-manager-evolution:latest
```

### Testar Execução

```bash
docker run -d \
  -p 3000:3000 \
  --name test-connections \
  --env-file .env \
  crangelp/connections-manager-evolution:latest
```

### Verificar Logs

```bash
docker logs -f test-connections
```

### Limpar Teste

```bash
docker stop test-connections
docker rm test-connections
```

---

## 🔄 Atualizar docker-compose.yml

Substitua o build local pela imagem do Docker Hub:

```yaml
services:
  app:
    # Remova a seção build:
    # build:
    #   context: .
    #   dockerfile: Dockerfile
    
    # Use imagem do Docker Hub
    image: crangelp/connections-manager-evolution:latest
    
    # ou versão específica
    # image: crangelp/connections-manager-evolution:1.5.0
```

---

## 🤖 Automação com GitHub Actions (Opcional)

Crie `.github/workflows/docker-publish.yml`:

```yaml
name: Docker Publish

on:
  push:
    tags:
      - 'v*'
  release:
    types: [published]

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: crangelp/connections-manager-evolution
          tags: |
            type=ref,event=tag
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=raw,value=latest
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Configurar Secrets no GitHub

1. Acesse: Settings → Secrets and variables → Actions
2. Adicione:
   - `DOCKERHUB_USERNAME`: seu username
   - `DOCKERHUB_TOKEN`: token do Docker Hub

**Criar Token:** https://hub.docker.com/settings/security

---

## 📊 Verificar Imagem Publicada

**Docker Hub:**
https://hub.docker.com/r/crangelp/connections-manager-evolution

**Informações da imagem:**
```bash
docker images crangelp/connections-manager-evolution
```

**Inspeção detalhada:**
```bash
docker inspect crangelp/connections-manager-evolution:latest
```

---

## 🎯 Comandos Rápidos

```bash
# Login
docker login

# Build multi-platform e push
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t crangelp/connections-manager-evolution:1.5.0 \
  -t crangelp/connections-manager-evolution:latest \
  --push .

# Verificar
docker pull crangelp/connections-manager-evolution:latest
```

---

## 🔒 Boas Práticas

1. ✅ Sempre use tags específicas de versão
2. ✅ Mantenha `latest` sempre atualizado
3. ✅ Use multi-platform builds
4. ✅ Adicione labels na imagem
5. ✅ Documente no Docker Hub
6. ✅ Configure GitHub Actions para CI/CD

---

## 📝 Atualizando README no Docker Hub

No Docker Hub, adicione:

```markdown
# Connections Manager Evolution

Dashboard moderno para gerenciar instâncias WhatsApp via Evolution API.

## Quick Start

```bash
docker pull crangelp/connections-manager-evolution:latest
docker run -d -p 3000:3000 --env-file .env crangelp/connections-manager-evolution:latest
```

## Variáveis de Ambiente

Ver documentação completa: https://github.com/CRangelP/Connections-Manager-Evolution

## Tags Disponíveis

- `latest` - Última versão estável
- `1.5.0` - Versão específica

## Suporte

GitHub: https://github.com/CRangelP/Connections-Manager-Evolution/issues
```

---

**Link Docker Hub:** https://hub.docker.com/r/crangelp/connections-manager-evolution
