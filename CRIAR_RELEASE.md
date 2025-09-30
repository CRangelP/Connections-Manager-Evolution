# 📦 Como Criar o Release v1.5.0 no GitHub

## Passo a Passo

### 1. Acesse a página de releases
```
https://github.com/CRangelP/Connections-Manager-Evolution/releases/new
```

### 2. Preencha os campos

**Tag version:**
```
v1.5.0
```

**Target:** `main`

**Release title:**
```
🚀 v1.5.0 - Integração Chatwoot & Docker Production-Ready
```

**Description:** 
Copie e cole o conteúdo de `RELEASE_NOTES_v1.5.0.md`

### 3. Marque as opções

- ✅ **Set as the latest release** (marcar como latest)
- ✅ **Create a discussion for this release** (opcional)

### 4. Clique em "Publish release"

---

## ✨ Ou use o GitHub CLI (se instalado)

```bash
gh release create v1.5.0 \
  --title "🚀 v1.5.0 - Integração Chatwoot & Docker Production-Ready" \
  --notes-file RELEASE_NOTES_v1.5.0.md \
  --latest
```

---

## 🎯 Resultado Esperado

Após criar o release:

1. ✅ Tag `v1.5.0` marcada como **latest**
2. ✅ Release notes completas visíveis
3. ✅ Assets disponíveis para download (source code)
4. ✅ Notificação para watchers do repositório

---

## 📋 Checklist Pós-Release

- [ ] Verificar se release está marcado como "Latest"
- [ ] Conferir se release notes estão formatadas corretamente
- [ ] Testar download do source code
- [ ] Compartilhar nas redes sociais (opcional)
- [ ] Atualizar documentação externa se houver

---

**Link do Release:** 
https://github.com/CRangelP/Connections-Manager-Evolution/releases/tag/v1.5.0
