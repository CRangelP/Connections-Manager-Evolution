# 🐳 Deploy com Docker Swarm

## 📋 Pré-requisitos

- Docker Swarm inicializado
- Rede `ia2s` criada
- Traefik configurado (para SSL)
- Imagem no Docker Hub: `ia2ssuporte/connections-manager-evolution:latest`

## 🚀 Deploy no Swarm

### 1. Configurar Variáveis de Ambiente

Edite o `stack.yaml` e ajuste as variáveis:

```yaml
environment:
  # ⚠️ IMPORTANTE: Altere estas variáveis
  - NEXTAUTH_URL=https://app.ia2s.com.br
  - NEXTAUTH_SECRET=your_secret_here_minimum_32_characters
  - EVOLUTION_API_TOKEN=your_token_here
  - CHATWOOT_TOKEN=your_chatwoot_token
```

### 2. Deploy da Stack

```bash
# Deploy da stack
docker stack deploy -c stack.yaml connections-manager

# Verificar status
docker stack services connections-manager

# Ver logs
docker service logs -f connections-manager_connections-manager
```

### 3. Verificar Deploy

```bash
# Listar serviços
docker service ls

# Inspecionar serviço
docker service ps connections-manager_connections-manager

# Health check
curl https://app.ia2s.com.br/api/health
```

## 🔄 Atualizar Imagem

```bash
# Pull nova imagem
docker pull ia2ssuporte/connections-manager-evolution:latest

# Forçar atualização do serviço
docker service update --image ia2ssuporte/connections-manager-evolution:latest connections-manager_connections-manager

# Ou redeploy da stack
docker stack deploy -c stack.yaml connections-manager
```

## 🛑 Remover Stack

```bash
# Remove a stack completa
docker stack rm connections-manager
```

## ⚙️ Configurações do Stack

### Recursos
- **CPU**: 1 core (limite), 0.25 core (reserva)
- **RAM**: 512MB (limite), 256MB (reserva)
- **Replicas**: 1 (stateless)

### Traefik Labels
- **Host**: `app.ia2s.com.br`
- **SSL**: Let's Encrypt (automático)
- **Health Check**: `/api/health` (30s interval)
- **Port**: 3000

### Restart Policy
- **Condition**: any
- **Delay**: 5s
- **Max Attempts**: 3
- **Window**: 120s

## 📊 Monitoramento

### Ver logs em tempo real
```bash
docker service logs -f connections-manager_connections-manager --tail 100
```

### Ver métricas do serviço
```bash
docker service ps connections-manager_connections-manager
```

### Health check manual
```bash
curl -X GET https://app.ia2s.com.br/api/health
```

## 🔧 Troubleshooting

### Serviço não inicia
```bash
# Ver logs de erro
docker service logs connections-manager_connections-manager

# Verificar eventos
docker events --filter service=connections-manager_connections-manager
```

### Rollback manual
```bash
docker service rollback connections-manager_connections-manager
```

### Escalar serviço (não recomendado - stateless SQLite)
```bash
# Aumentar réplicas
docker service scale connections-manager_connections-manager=2
```

## 🌐 Acesso

Após deploy bem-sucedido:

**URL**: https://app.ia2s.com.br

**Login**:
- Email: `admin@evolutiondash.com`
- Senha: `Admin@123`

## 🔒 Segurança

**⚠️ Importante:**
1. Altere `NEXTAUTH_SECRET` (mínimo 32 caracteres)
2. Altere `ADMIN_PASSWORD` após primeiro login
3. Use secrets do Docker Swarm para produção
4. Nunca commite credenciais reais

## 📝 Notas

- Container **stateless** (banco SQLite recriado a cada restart)
- Dados de instâncias vêm da Evolution API
- Configurações no arquivo `stack.yaml`
- SSL gerenciado automaticamente pelo Traefik
