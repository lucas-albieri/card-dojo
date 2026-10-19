// Dados e tipos do jogo. Nada aqui depende do Phaser.
export type ElementType = 'fire' | 'water' | 'plant';
export type CardKind = 'basic' | 'special';

export interface Card {
    id?: string;
    element: ElementType;
    value: number; // número impresso na carta
    color: number; // índice em COLORS
    kind?: CardKind;
    artKey?: string;
    animation?: string;
}

export interface CardDefinition extends Card {
    id: string;
    kind: CardKind;
}

export interface MonsterDef {
    id: string;
    name: string;
    sprite: string;
    deck: CardDefinition[];
}

export type AiLevel = 1 | 2 | 3;

export interface OpponentDef {
    id: string;
    monsterId: string;
    aiLevel: AiLevel;
    boss?: boolean;
}

export type TowerUnlock =
    | { type: 'default' }
    | { type: 'clear-tower'; towerId: string };

export interface TowerDef {
    id: string;
    name: string;
    unlock: TowerUnlock;
    floors: OpponentDef[];
    rewardPoolsByHero: Record<string, string[]>;
}

export interface ElementInfo {
    label: string;
    tint: number;
    beats: ElementType; // elemento que este derrota
    fx: { gravityY: number; speed: { min: number; max: number } }; // partículas
}

export const ELEMENTS: Record<ElementType, ElementInfo> = {
    fire: { label: 'Fogo', tint: 0xf25c2a, beats: 'plant', fx: { gravityY: -220, speed: { min: 60, max: 220 } } },
    water: { label: 'Água', tint: 0x2f80ed, beats: 'fire', fx: { gravityY: 380, speed: { min: 100, max: 300 } } },
    plant: { label: 'Planta', tint: 0x9fe8ff, beats: 'water', fx: { gravityY: 40, speed: { min: 40, max: 140 } } },
};

export const ELEMENT_LIST = Object.keys(ELEMENTS) as ElementType[];
export const COLORS = [0xe63946, 0xf4a300, 0x2ec27e, 0x9b5de5];