# Card Dojo — plano (guia rápido para IA)

Jogo de cartas 2D para navegador, **só para mim e meus amigos**. Inspirado no Card-Jitsu (Club Penguin), com estética Ben 10. Nome provisório.

## Convenções
- Código em **inglês** (constantes, variáveis, funções, tipos); textos da tela em **português**.
- Arquivos em **kebab-case** (`mini-card.ts`).
- `core/` **nunca importa Phaser** (regras puras, para testar e rodar no servidor depois).
- Posições e escalas só em `src/layout.ts`. Sem `pixelArt` no Phaser. Respeitar `REDUCED_MOTION`.
- Refatoração grande: conversar comigo antes. Entregar arquivos completos e dizer onde ficam.

## Stack
Phaser 4 + TypeScript + Vite, gerenciado com **Bun**. Jogo em **1920×1080** (`Scale.FIT`). Fonte Fredoka.

## O jogo
- Jogador escolhe um **monstro** (quantos eu conseguir fazer); cada um tem **baralho, arte e animações próprias**.
- Elementos: **fogo > planta > água > fogo**. Mesmo elemento: maior valor vence; valor igual: empate.
- Carta básica ou especial = `{ id, kind, element, value (2–12), color (0–3), animation? }`. Cada monstro tem seu baralho; a primeira versão sorteia continuamente e repõe 1 carta após cada rodada.
- Carta especial mantém as regras atuais e ativa sua finalização visual quando vence a rodada.
- Vitória: 3 cartas ganhas do mesmo elemento com cores diferentes, ou uma de cada elemento com cores diferentes.
- Oponente hoje aleatório (`ai/opponent.ts`).
- Começar com **1 monstro completo**. Carta sem animação especial usa a animação padrão do elemento e a arte do monstro.
- Multiplayer só no fim; antes, um **cenário inicial (lobby)** onde os jogadores vão se encontrar.

## Arquitetura
```
src/
├── main.ts · config.ts · layout.ts      # entrada, constantes, posições
├── core/   types.ts deck.ts rules.ts    # regras puras
├── ai/     opponent.ts
├── ui/     card-view mini-card dojo-background fighter util
└── scenes/ battle.ts
```
**A criar:** `data/monsters/<id>.ts` (dados do monstro), `ui/animations/` (defaults por elemento + especiais por monstro), cenas `boot`, `title`, `monster-select`, `pause`, `result`, `lobby`.

```ts
export const monster: MonsterDef = {
  id: 'monster-id', name: 'Nome', sprite: 'monster-id',
  deck: [{ id: 'fire-special', kind: 'special', element: 'fire', value: 8, color: 0, artKey: 'monster-id-card-fire', animation: 'flame-burst' }],
};
```
`createCard(deck)` sorteia e copia uma definição do baralho; sem argumento, mantém o sorteio procedural legado. `animation` é opcional e será interpretada pela camada visual.

## Artes (eu faço, personagem inteiro por pose, sem separar em partes)
- Estilo 2D suave: contorno uniforme, cores chapadas, 1 tom de sombra. Desenhar em 2× e exportar reduzindo. PNG transparente.
- **Lutador:** 512×512, virado para a direita, pés centralizados embaixo (~16 px de margem), ~450 px de altura. **Todas as poses no mesmo quadro e com os pés no mesmo lugar.**
- Poses: `idle`, `windup`, `attack`, `hit`, `win`. Idle pode ser 1 frame (o código faz a respiração) ou um loop curto.
- **Carta:** ilustração 300×270 sem moldura (o código desenha moldura, cor e valor); começar com 1 por elemento. Verso 330×450 (opcional). Ícones 128×128 (opcional).
- Pasta: `public/assets/monsters/<id>/` com `fighter-idle.png`, `fighter-windup.png`, `fighter-attack.png`, `fighter-hit.png`, `fighter-win.png`, `card-fire.png`, `card-water.png`, `card-plant.png`.

## Animação das cartas
Cada animação é uma **receita em passos**: troca de pose do atacante (com esticar/achatar por tween), projétil (sprite por elemento), reação do alvo, efeito de cenário (já existem `flash`, `burst` e `shake`; faltam chuva, escurecer, troca de fundo).
```ts
export const throwBall = async ({ attacker, target, scene }) => {
  await attacker.pose('windup'); await attacker.pose('attack');
  await flyProjectile(scene, attacker, target);
  target.pose('hit'); scene.weather('rain');
};
```
O `fighter.ts` precisa ganhar `pose(name)` (troca de textura). Hoje tem `hop()` e respiração.

## Telas
`boot → title → [lobby] → monster-select → battle → result`, com `pause` como overlay (`scene.launch`). O monstro escolhido vai por `scene.start('battle', { monster })`. Lobby começa como cenário simples, sem rede.

## Roadmap
- [x] Protótipo, estrutura Bun+Vite+TS, 1920×1080, cenário de dojo, sprite provisório do 1º monstro
- [x] Testes do núcleo e catálogo tipado com baralho inicial por monstro
- [ ] Cenas: `boot`, `title`, `monster-select`, `pause`, `result`, `lobby` simples
- [ ] Seleção de monstro integrada ao fluxo de batalha
- [ ] `fighter.pose()` + primeiras poses (`windup`, `attack`, `hit`) + 1ª animação com projétil e cenário
- [ ] Cartas e animações do 1º monstro; depois mais monstros
- [ ] Sons/música, IA melhor, multiplayer

## Ideias e bibliotecas (sugestões, nada obrigatório)
- **phaser3-rexUI** (rex plugins): botões, menus e listas prontos para as telas de seleção e pausa.
- **lil-gui**: painel para ajustar valores de `layout.ts` ao vivo no navegador, sem recarregar.
- **Atlas de texturas** (Free Texture Packer): junta as poses de cada monstro num arquivo só; carrega mais rápido.
- **Multiplayer (para amigos):** WebSocket nativo do Bun ou **Colyseus** (salas de jogo). O `core/` pode validar jogadas no servidor.
- **Hospedagem:** o jogo é estático (GitHub Pages, Netlify, Vercel); só o multiplayer precisa de servidor.

## Em aberto
Nome do jogo · verde da `COLORS` × verde do elemento planta · tecnologia do servidor. Coleção e desbloqueios são ideias para depois do primeiro loop local.