# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão Geral

**PokéDraft** é um web game auto-battler no navegador, temática Pokémon (Gens 1–2, IDs 1–251), inspirado no simulador "7 a 0". URL de produção: `https://pokedraft-game.vercel.app/`

## Stack Técnica (Restrições Rígidas)

- **Apenas Vanilla JS / HTML5 / CSS3** — zero frameworks, zero bibliotecas externas
- **100% client-side** — sem backend, sem servidor, sem Node.js
- **Zero IA no runtime** — nenhuma API de LLM para lógica de jogo
- **Dados:** PokéAPI (`https://pokeapi.co/`) — IDs 1–251 (Gen 1 + Gen 2)
- **Sprites treinadores:** Pokémon Showdown (`https://play.pokemonshowdown.com/sprites/trainers/`)
- **Arquivos:** `index.html`, `style.css`, `script.js`

## Como Rodar

Abrir `index.html` diretamente no navegador (sem servidor necessário). Opcionalmente:

```bash
python3 -m http.server 8080
```

## Arquitetura do Jogo

### Fase 1 — Draft
- Sorteia 3 Pokémon aleatórios (IDs 1–251) via PokéAPI
- Exibe: Sprite, Nome, Tipos, Atq/Def/HP
- Jogador escolhe 1 por rodada, até completar 6 no squad
- Shiny: 2% de chance por Pokémon; sprite shiny da PokéAPI; bônus permanente de +10% em todos os stats

### Fase 2 — Pré-Jogo
- 12 batalhas sequenciais: 8 Ginásios + 3 Elite Four + Campeão Lance
- Jogador reordena seus 6 Pokémon via Drag-and-Drop
- Ordem travada após iniciar batalha
- Névoa de guerra: jogador vê apenas Nome do Líder, Especialidade e Pokémon "Ás"; os outros 5 ficam ocultos
- Card do oponente exibe sprite do treinador (Pokémon Showdown)

### Fase 3 — Batalha (Auto-Battler)
Simulação automática instantânea. Duelo 1v1 sequencial:

**Fórmula do Duelo:**
1. `Força = BST (Base Stat Total)` — HP + Atq + Def + Atq.Esp + Def.Esp + Vel
2. Multiplicador de Tipo: sistema de score por interações positivas/negativas
   - Score ≥ 2 → ×1.40 (dupla fraqueza)
   - Score = 1 → ×1.25 (super efetivo)
   - Score = -1 → ×0.75 (não muito efetivo)
   - Score ≤ -2 → ×0.60 (dupla resistência)
3. RNG: `Math.random()` → multiplicador entre `0.85` e `1.15`
4. Maior Força Final vence; perdedor desmaia

**Fadiga (mecânica crítica):** O vencedor perde `Math.min(forçaAtualOponente, BSTBruto)` — evita que Pokémon quase desmaiado cause fadiga desproporcional.

**Cura:** Time do jogador é curado 100% em `aposVitoria()` antes de avançar para o próximo ginásio.

**Log narrativo:** Batalha exibida como texto descendente com sprites piscando/apagando. Design visual inspirado em FireRed/LeafGreen (arena com gradiente noturno, caixa de diálogo bege estilo GBA).

## Features Implementadas

- **Re-Draft (Coringa):** Botão único por campanha, disponível a partir da 7ª batalha (`REDRAFT_GINASIO_MINIMO = 6`). Sacrifica 1 Pokémon e sorteia 3 novos com odds pesadas (80% forte, 20% médio, 0% fraco). Ver as opções já consome o coringa — inclusive se o jogador optar por manter o Pokémon atual.
- **Poção:** Botão toggle disponível a partir da 11ª batalha (E4-3). Aparece como botão na tela de pré-jogo (igual ao Re-Draft). Quando selecionado, aplica +20% de força ao último Pokémon do squad quando ele entra em campo. Consumida uma única vez por campanha. Hint de countdown visível nas batalhas anteriores (apenas quando Re-Draft já foi usado).
- **Insígnias:** 8 badges de Kanto + 8 de Johto disponíveis no pool. SVGs embutidos diretamente no JS — `BADGE_SVGS` em `script.js`. Exibidas em grid 4×2 na tela de resultado.
- **Compartilhamento:** Ao fim (vitória ou derrota), gera imagem via Canvas API compartilhável.
- **Tela de Resultado:** Exibe insígnias conquistadas, time completo (grid 3×2), MVP (Pokémon com mais vitórias individuais) e subtítulo de derrota com posição ("Eliminado por X (Nº Ginásio/Elite Four)").

## Pools e Dificuldade

### Pools de Líderes
- `POOL_GINASIOS` — 16 líderes (8 Kanto + 8 Johto); 8 sorteados aleatoriamente por campanha
- `POOL_ELITE` — 6 membros (3 Kanto + 3 Johto); 3 sorteados por campanha
- `CAMPEAO` — Lance (fixo, sempre o último)

### Dificuldade (`DIF_POR_POSICAO`)
Multiplicador aplicado ao BST do time adversário por posição:
```javascript
[1.10, 1.14, 1.15, 1.17, 1.20, 1.22, 1.24, 1.26, // 8 ginásios
 1.15, 1.18, 1.21,                                  // 3 Elite Four
 1.24]                                              // Lance
```
Calibrado via simulação de 30k campanhas — taxa de campeão estimada ~17% para jogador com draft ótimo.

### Tiers de Draft
BST classifica Pokémon em 3 tiers (limiares em `BST_LOOKUP`):
- Fraco: BST < 421
- Médio: BST 421–479
- Forte: BST ≥ 480

Draft normal (`idAleatorio`): 15% fraco / 35% médio / 50% forte
Re-Draft (`idAleatorioPesado`): 0% fraco / 20% médio / 80% forte

## Estrutura do Código (`script.js`)

- `estado` — objeto global: `squad`, `liga`, `ginasioAtual`, `insignias`, `redraftUsado`, `redraftSlotAlvo`, `pocaoDisponivel`, `pocaoSelecionada`, `vitoriasPorPk`
- `POOL_GINASIOS[]` / `POOL_ELITE[]` / `CAMPEAO` — pools de oponentes com `nome`, `time[]`, `trainerSprite`, `insignia`, `dif`
- `BST_LOOKUP[]` — BST de cada Pokémon por ID (índice 0 não usado)
- `BADGE_SVGS{}` — SVGs inline das insígnias
- `VANTAGENS{}` — tabela de tipos para cálculo de multiplicador
- `DIF_POR_POSICAO[]` — multiplicadores de dificuldade por posição (12 valores)
- `getMultTipo()` — retorna multiplicador via sistema de score
- `simularBatalha()` — retorna log completo da batalha (síncrono)
- `animarBatalha()` — reproduz o log na tela com delays (assíncrono)
- `aposVitoria()` — concede insígnia, restaura time, libera poção na posição 9, avança ginásio
- `sortearLiga()` — embaralha e seleciona 8 ginásios + 3 E4 + Lance
- `buscarPokemon()` — fetch com cache em `localStorage` (chave `pk2_${id}`)

## Convenções de Desenvolvimento

- **Idioma:** Todo código, comentários e mensagens em PT-BR
- **Commit e push:** Sempre fazer após cada mudança implementada
- **Cache PokéAPI:** `localStorage` com chave `pk2_${id}` para dados de Pokémon
- **Sem fetch para insígnias:** badges usam `BADGE_SVGS` (SVG inline), não API externa
- **Sprites treinadores:** arquivo `.png` no Pokémon Showdown; alguns líderes precisam de sufixo `-gen3` (ex: `sabrina-gen3.png`, `lorelei-gen3.png`, `agatha-gen3.png`)
- **Simulação de dificuldade:** antes de ajustar `DIF_POR_POSICAO`, rodar simulação em `/tmp/sim_completo.js` com tipos reais, fadiga e draft para medir taxa de campeão — não ajustar por cálculo simplificado de BST médio
