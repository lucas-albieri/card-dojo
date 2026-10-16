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
    battleExitX: 200,
    battleExitY: 76,
    battleExitWidth: 360,
    battleExitHeight: 72,
    battlePauseX: 555,
    battlePauseY: 76,
    battlePauseWidth: 230,
    battlePauseHeight: 72,
    pausePanelWidth: 720,
    pausePanelHeight: 520,
    pauseTitleY: H * 0.36,
    pauseResumeY: H * 0.52,
    pauseExitY: H * 0.64,
    resultTitleY: H * 0.39,
    resultSubtitleY: H * 0.57,
    finisherProjectileStartOffsetX: 90,
    finisherProjectileTargetOffsetX: 90,
    finisherProjectileYOffset: 220,
    finisherProjectileSize: 52,
    finisherProjectileDuration: 520,
    finisherImpactFlashDuration: 180,

    // cartas jogadas no meio
    arenaY: H * 0.46,
    arenaPlayerX: W / 2 - 170,
    arenaFoeX: W / 2 + 170,
    arenaScale: 2.1,

    // mão do jogador (esquerda da barra)
    handY: Math.round(H * 0.89),
    handStartX: 290,
    handGap: 160,
    handScale: 1.2,

    // cartas viradas do oponente (direita da barra)
    foeBackStartX: W - 330,
    foeBackGap: 100,
    foeBackScale: 0.8,

    // cartas ganhas (canto superior)
    miniScale: 1.5,
    miniGap: 62,
    miniStartX: 70,
    miniY: 120,

    // tela inicial
    titleLogoX: W * 0.12,
    titleLogoY: H * 0.2,
    titleLogoScale: 0.14,
    titleHeadingX: W * 0.215,
    titleHeadingY: H * 0.2,
    titleTaglineY: H * 0.31,
    titleSplashX: W * 0.79,
    titleSplashY: H * 0.5,
    titleSplashScale: 0.67,
    titleButtonX: W * 0.39,
    titleButtonPrimaryY: H * 0.56,
    titleButtonSecondaryY: H * 0.69,
    titleButtonWidth: 600,
    titleButtonHeight: 96,

    // seleção de personagem
    selectLogoX: W * 0.1,
    selectLogoY: H * 0.11,
    selectLogoScale: 0.075,
    selectBackX: 140,
    selectBackY: 78,
    selectHeadingY: H * 0.12,
    selectSubtitleY: H * 0.205,
    selectSlotXs: [W * 0.18, W * 0.393, W * 0.607, W * 0.82],
    selectSlotY: H * 0.51,
    selectSlotWidth: 330,
    selectSlotHeight: 480,
    selectSplashScale: 0.2,
    selectActionX: W / 2,
    selectActionY: H * 0.84,
    selectActionWidth: 440,
    selectActionHeight: 90,

    // lobby do dojo
    lobbyBackgroundX: W / 2,
    lobbyBackgroundY: H / 2,
    lobbyLogoX: 142,
    lobbyLogoY: 112,
    lobbyLogoScale: 0.105,
    lobbyTitleX: 330,
    lobbyTitleY: 92,
    lobbySettingsX: W - 90,
    lobbySettingsY: 82,
    lobbyBattleX: W * 0.22,
    lobbyBattleY: H * 0.52,
    lobbyBattleWidth: 500,
    lobbyBattleHeight: 560,
    lobbyCharacterX: W * 0.82,
    lobbyCharacterY: H * 0.48,
    lobbyCharacterWidth: 470,
    lobbyCharacterHeight: 600,
    lobbySplashX: 1615,
    lobbySplashY: 501,
    lobbySplashWidth: 394,
    lobbySplashHeight: 554,
    lobbyDeckX: W / 2,
    lobbyDeckY: H * 0.79,
    lobbyDeckWidth: 500,
    lobbyDeckHeight: 220,
    lobbySelectedX: 255,
    lobbySelectedY: H - 82,
};