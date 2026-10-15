import { GAME_WIDTH as W, GAME_HEIGHT as H } from './config';

// Todas as posições da tela num lugar só (base 1920x1080).
// Mexeu no visual? Ajuste aqui, não dentro da cena.
export const LAYOUT = {
    // cenário
    floorTop: H * 0.43,   // onde a parede termina e o ringue começa
    ropes: [H * 0.46, H * 0.54],
    frontEdge: H * 0.69,  // borda ondulada na frente do ringue
    barTop: H * 0.76,     // topo da barra de baixo (cartas)

    // personagens (origem = centro dos pés)
    fighterY: H * 0.65,
    fighterLeftX: W * 0.24,
    fighterRightX: W * 0.76,
    fighterScale: 1.25,

    // texto de status
    statusY: H * 0.14,

    // cartas jogadas no meio
    arenaY: H * 0.46,
    arenaPlayerX: W / 2 - 170,
    arenaFoeX: W / 2 + 170,
    arenaScale: 2.1,

    // mão do jogador (esquerda da barra)
    handY: Math.round(H * 0.89),
    handStartX: 300,
    handGap: 175,
    handScale: 1.35,

    // cartas viradas do oponente (direita da barra)
    foeBackStartX: W - 360,
    foeBackGap: 104,
    foeBackScale: 0.85,

    // cartas ganhas (canto superior)
    miniScale: 1.5,
    miniGap: 62,
    miniStartX: 70,
    miniY: 120,
};