import type { MonsterDef } from '../../core/types';

export const ultraTAssets = {
    sprite: '/assets/monsters/ultra-t/ultra-t.png',
    logo: '/assets/monsters/ultra-t/icon.png',
    splash: '/assets/monsters/ultra-t/banner.png',
} as const;

const cardDirectory = '/assets/monsters/ultra-t/deck';

export const ultraTCardAssets = [
    { key: 'card-fire-1', path: `${cardDirectory}/fogo1.png` },
    { key: 'card-fire-2', path: `${cardDirectory}/fogo2.png` },
    { key: 'card-fire-3', path: `${cardDirectory}/fogo3.png` },
    { key: 'card-fire-4', path: `${cardDirectory}/fogo4.png` },
    { key: 'card-fire-5', path: `${cardDirectory}/fogo5.png` },
    { key: 'card-water-1', path: `${cardDirectory}/agua1.png` },
    { key: 'card-water-2', path: `${cardDirectory}/agua2.png` },
    { key: 'card-water-3', path: `${cardDirectory}/agua3.png` },
    { key: 'card-water-4', path: `${cardDirectory}/agua4.png` },
    { key: 'card-water-5', path: `${cardDirectory}/agua5.png` },
    { key: 'card-plant-1', path: `${cardDirectory}/planta1.png` },
] as const;

export const ultraT: MonsterDef = {
    id: 'ultra-t',
    name: 'Ultra T',
    sprite: 'monster-ultra-t',
    deck: [
        { id: 'fire-basic-1', kind: 'basic', element: 'fire', value: 1, color: 0, artKey: 'card-fire-1' },
        { id: 'fire-basic-2', kind: 'basic', element: 'fire', value: 2, color: 2, artKey: 'card-fire-2' },
        { id: 'fire-special', kind: 'special', element: 'fire', value: 3, color: 1, animation: 'ninja-cut', artKey: 'card-fire-3' },
        { id: 'water-basic-1', kind: 'basic', element: 'water', value: 1, color: 1, artKey: 'card-water-1' },
        { id: 'water-basic-2', kind: 'basic', element: 'water', value: 2, color: 3, artKey: 'card-water-2' },
        { id: 'water-special', kind: 'special', element: 'water', value: 3, color: 2, animation: 'snow-freeze', artKey: 'card-water-3' },
        { id: 'plant-basic-1', kind: 'basic', element: 'plant', value: 1, color: 0, artKey: 'card-plant-1' },
        { id: 'plant-basic-2', kind: 'basic', element: 'plant', value: 1, color: 3, artKey: 'card-plant-1' },
        { id: 'plant-special', kind: 'special', element: 'plant', value: 1, color: 1, animation: 'vine-cage', artKey: 'card-plant-1' },
        { id: 'water-basic-3', kind: 'basic', element: 'water', value: 4, color: 1, artKey: 'card-water-4' },
    ],
};