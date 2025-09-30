# 🐳 Instalação do Docker no Ubuntu/Debian

## Método 1: Instalação Oficial (Recomendado)

```bash
# Remover versões antigas
sudo apt-get remove docker docker-engine docker.io containerd runc

# Atualizar repositórios
sudo apt-get update

# Instalar dependências
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Adicionar chave GPG oficial do Docker
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Adicionar repositório do Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Atualizar e instalar Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Adicionar seu usuário ao grupo docker (para não precisar de sudo)
sudo usermod -aG docker $USER

# Aplicar mudanças de grupo (ou faça logout/login)
newgrp docker

# Testar instalação
docker --version
docker run hello-world
```

## Método 2: Instalação Rápida (apt)

```bash
# Instalar Docker do repositório Ubuntu
sudo apt update
sudo apt install -y docker.io

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Testar
docker --version
```

## Verificar Instalação

```bash
# Versão do Docker
docker --version

# Versão do Docker Compose
docker compose version

# Teste
docker run hello-world
```

## Após Instalação

```bash
# Login no Docker Hub
docker login

# Build da imagem
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t crangelp/connections-manager-evolution:1.5.0 \
  -t crangelp/connections-manager-evolution:latest \
  --push \
  .
```
