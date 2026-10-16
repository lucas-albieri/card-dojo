import type { MonsterDef } from '../../core/types';

export const ultraTAssets = {
    sprite: '/assets/monsters/ultra-t/ultra-t.png',
    logo: '/assets/monsters/ultra-t/icon.png',
    splash: '/assets/monsters/ultra-t/banner.png',
    blueCard1: '/assets/monsters/ultra-t/deck/blue-card-1.png',
} as const;

export const ultraT: MonsterDef = {
    id: 'ultra-t',
    name: 'Ultra T',
    sprite: 'monster-ultra-t',
    deck: [
        { id: 'fire-basic-1', kind: 'basic', element: 'fire', value: 6, color: 0 },
        { id: 'fire-basic-2', kind: 'basic', element: 'fire', value: 9, color: 2 },
        { id: 'fire-special', kind: 'special', element: 'fire', value: 11, color: 1, animation: 'ninja-cut' },
        { id: 'water-basic-1', kind: 'basic', element: 'water', value: 5, color: 1 },
        { id: 'water-basic-2', kind: 'basic', element: 'water', value: 8, color: 3 },
        { id: 'water-special', kind: 'special', element: 'water', value: 12, color: 2, animation: 'snow-freeze' },
        { id: 'plant-basic-1', kind: 'basic', element: 'plant', value: 7, color: 0 },
        { id: 'plant-basic-2', kind: 'basic', element: 'plant', value: 10, color: 3 },
        { id: 'plant-special', kind: 'special', element: 'plant', value: 9, color: 1, animation: 'vine-cage' },
        { id: 'water-basic-3', kind: 'basic', element: 'water', value: 8, color: 1, artKey: 'card-blue-1' },
    ],
};