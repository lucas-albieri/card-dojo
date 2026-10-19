# Card Dojo — modos, torres e lore

Complementa o `project-plan.md` (leia os dois). Mesmas convenções: código em inglês, textos da tela em português, arquivos em kebab-case, `core/` sem Phaser.

**Regra para a IA:** a lore ainda **não está definida**. Não invente história. Use textos provisórios e marque com `TODO(lore)`.

## 1. Modos de jogo

Tela `mode-select` depois da `title`:

| Modo | Estado |
|---|---|
| **Torre** | implementada: loop jogável com 3 torres cadastradas |
| História | bloqueado ("em breve") |
| Multiplayer | bloqueado ("em breve") |

Fluxo da torre: `title → mode-select → tower-select → monster-select → tower-run → battle → reward → … → boss → fim`. O `DOJO LIVRE` mantém a batalha clássica.

## 2. Torres

- **Várias torres**, começando por **1 liberada**; as outras já aparecem **bloqueadas** (cadeado e nome oculto "???").
- Desbloqueio padrão: **vencer o boss da torre anterior**. Fica nos dados, para poder mudar.
- Cada torre tem **5 adversários + boss** (6 lutas). A quantidade é só o tamanho da lista nos dados (pode virar 10).
- Nomes e temas das torres: `TODO(lore)`. Sugestão: uma torre por elemento nas seguintes.

```ts
interface TowerDef {
  id: string; name: string;
  unlock: { type: 'default' } | { type: 'clear-tower'; towerId: string };
  floors: OpponentDef[];   // o último é o boss
  rewardPoolsByHero: Record<string, string[]>; // especiais específicas do herói
}
interface OpponentDef { id: string; monsterId: string; aiLevel: 1 | 2 | 3; boss?: boolean }
```

## 3. Regras da torre

- Baralho na torre = **cartas básicas do monstro escolhido + cartas especiais ganhas na corrida**. As cartas fixas do deck (desbloqueadas) valem **só no modo história**.
- Após cada vitória nos cinco andares normais: tela `reward` com até **3 cartas especiais sorteadas do pool do herói, escolher 1** (sem repetir na mesma corrida). As opções podem cair para 2 ou 1 quando restarem menos cartas.
- As especiais escolhidas entram no baralho normal da corrida; **não são garantidas na mão**. A batalha mantém o sorteio normal do baralho.
- Derrota = fim da corrida; recomeça do andar 1. Vencer o boss = torre concluída, libera a próxima.
- As cartas especiais são **específicas de cada herói**. O primeiro pool contém cinco cartas provisórias do Ultra T.
- Existem três torres nos dados: Torre 1 liberada, Torres 2 e 3 bloqueadas; vencer o boss libera a torre seguinte.

## 4. A batalha não conhece o modo

`battle` recebe tudo por parâmetro; quem monta isso são os modos (`tower-run` agora, `story` depois).

```ts
interface BattleParams {
  playerDeck: CardDef[];        // deck montado pelo modo
  opponent: OpponentDef;
  onFinish: (result: { won: boolean }) => void;
}
```
No modo Torre, `playerDeck` contém apenas as básicas do herói e as especiais ganhas na corrida. O caminho legado de batalha livre continua disponível.

## 5. IA do oponente (`ai/opponent.ts`)

A IA aleatória não sustenta uma escada de dificuldade. Níveis simples:
1. aleatória (primeiras lutas);
2. prefere elementos que completam a condição de vitória dela;
3. (boss) joga o elemento que **bloqueia** a condição de vitória do jogador. Pode ter um bônus, como mão maior.

## 6. Progresso e save

- `core/progress.ts`: tipos e funções **puras** (torres liberadas, melhor andar).
- `storage/local-save.ts`: **único** arquivo que toca `localStorage`. Chave com versão (`card-dojo-save-v1`).
- Guardar: torres liberadas/concluídas e **melhor andar por torre e por herói**.
- A corrida em andamento **não é salva** (zera ao sair).

## 7. Onde lore e textos vivem

Tudo em **dados**, nunca dentro das cenas:

```
src/data/lore/
├── monsters.ts     # bio curta de cada monstro
├── towers.ts       # abertura e final de cada torre
└── dialogues.ts    # falas antes/depois da luta, por id de adversário
```
`ui/dialogue-box.ts`: caixa de texto simples (nome, fala, avançar com clique). O `tower-run` mostra o diálogo antes da luta **se existir**; sem texto, pula.

**Lore em aberto:** premissa (torneio do dojo, dispositivo que invoca monstros, ou equilíbrio dos elementos), tom (épico ou bem-humorado, com piadas dos amigos) e quem é o jogador.

## 8. Áudio (depois)

Phaser já toca áudio. Pasta `public/assets/audio/`, formatos `.ogg` e `.mp3`. Músicas: título, batalha, boss, vitória. Efeitos: virar carta, jogar carta, vencer/perder rodada, um por elemento. Um `ui/audio.ts` pequeno controla volume e mudo (mudo salvo no `localStorage`).

## 9. Estrutura nova

```
src/
├── core/     tower.ts progress.ts        # estado da corrida, progresso (puros)
├── storage/  local-save.ts
├── data/     towers/  specials.ts  lore/
├── ui/       dialogue-box.ts  audio.ts
└── scenes/   mode-select tower-select tower-run reward
```
Testar `core/tower.ts` e `core/progress.ts` com `bun test`.

## 10. Ordem de implementação

- [x] 1. Tornar `battle` reutilizável com deck, oponente e callback de resultado, mantendo o modo livre
- [x] 2. `mode-select` (torre e dojo livre ativos; história e multiplayer bloqueados)
- [x] 3. `core/tower.ts`, `core/progress.ts`, `storage/local-save.ts` + testes
- [x] 4. Dados: Torre 1 (5 + boss), 5 especiais provisórias por herói e 2 torres bloqueadas
- [x] 5. `tower-select`, `tower-run`, `reward`
- [x] 6. Níveis de IA e boss
- [ ] 7. `dialogue-box` e textos de lore
- [x] 8. Áudio

## 11. Em aberto

Premissa e tom da lore · nomes e temas finais das torres · conteúdo narrativo do modo história.