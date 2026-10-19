import type { TowerDef } from '../../core/types';
import { HERO_SPECIALS } from './specials';

const placeholderFloors = (towerId: string) => [
    { id: `${towerId}-floor-1`, monsterId: 'ultra-t', aiLevel: 1 as const },
    { id: `${towerId}-floor-2`, monsterId: 'ultra-t', aiLevel: 1 as const },
    { id: `${towerId}-floor-3`, monsterId: 'ultra-t', aiLevel: 2 as const },
    { id: `${towerId}-floor-4`, monsterId: 'ultra-t', aiLevel: 2 as const },
    { id: `${towerId}-floor-5`, monsterId: 'ultra-t', aiLevel: 2 as const },
    { id: `${towerId}-boss`, monsterId: 'ultra-t', aiLevel: 3 as const, boss: true },
];

// TODO(lore): nomes, temas, adversários e diálogos oficiais das torres.
export const TOWERS: readonly TowerDef[] = [
    {
        id: 'dojo-tower-1',
        name: 'Torre 1',
        unlock: { type: 'default' },
        floors: placeholderFloors('dojo-tower-1'),
        rewardPoolsByHero: Object.fromEntries(
            Object.entries(HERO_SPECIALS).map(([heroId, cards]) => [heroId, cards.map(card => card.id)]),
        ),
    },
    {
        id: 'dojo-tower-2',
        name: 'Torre 2',
        unlock: { type: 'clear-tower', towerId: 'dojo-tower-1' },
        floors: placeholderFloors('dojo-tower-2'),
        rewardPoolsByHero: Object.fromEntries(
            Object.entries(HERO_SPECIALS).map(([heroId, cards]) => [heroId, cards.map(card => card.id)]),
        ),
    },
    {
        id: 'dojo-tower-3',
        name: 'Torre 3',
        unlock: { type: 'clear-tower', towerId: 'dojo-tower-2' },
        floors: placeholderFloors('dojo-tower-3'),
        rewardPoolsByHero: Object.fromEntries(
            Object.entries(HERO_SPECIALS).map(([heroId, cards]) => [heroId, cards.map(card => card.id)]),
        ),
    },
];

export function getTower(towerId: string): TowerDef {
    const tower = TOWERS.find(candidate => candidate.id === towerId);
    if (!tower) throw new Error(`Unknown tower "${towerId}".`);
    return tower;
}
