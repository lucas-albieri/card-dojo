// Dados e tipos do jogo. Nada aqui depende do Phaser.
export type ElementType = 'fire' | 'water' | 'plant';

export interface Card {
    element: ElementType;
    value: number; // 2 a 12
    color: number; // índice em COLORS
    artKey?: string;
}

export interface ElementInfo {
    icon: string;
    label: string;
    tint: number;
    beats: ElementType; // elemento que este derrota
    fx: { gravityY: number; speed: { min: number; max: number } }; // partículas
}

export const ELEMENTS: Record<ElementType, ElementInfo> = {
    fire: { icon: '🔥', label: 'Fogo', tint: 0xf25c2a, beats: 'plant', fx: { gravityY: -220, speed: { min: 60, max: 220 } } },
    water: { icon: '💧', label: 'Água', tint: 0x2f80ed, beats: 'fire', fx: { gravityY: 380, speed: { min: 100, max: 300 } } },
    plant: { icon: '🌱', label: 'Planta', tint: 0x9fe8ff, beats: 'water', fx: { gravityY: 40, speed: { min: 40, max: 140 } } },
};

export const ELEMENT_LIST = Object.keys(ELEMENTS) as ElementType[];
export const COLORS = [0xe63946, 0xf4a300, 0x2ec27e, 0x9b5de5];