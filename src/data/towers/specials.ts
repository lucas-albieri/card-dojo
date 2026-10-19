import type { CardDefinition } from '../../core/types';

// TODO(lore): nomes, descrições, valores e artes finais das cartas especiais.
export const HERO_SPECIALS: Record<string, CardDefinition[]> = {
    'ultra-t': [
        { id: 'ultra-t-special-ninja-cut', kind: 'special', element: 'fire', value: 3, color: 1, animation: 'ninja-cut', artKey: 'card-fire-3' },
        { id: 'ultra-t-special-snow-freeze', kind: 'special', element: 'water', value: 3, color: 2, animation: 'snow-freeze', artKey: 'card-water-3' },
        { id: 'ultra-t-special-vine-cage', kind: 'special', element: 'plant', value: 1, color: 1, animation: 'vine-cage', artKey: 'card-plant-1' },
        { id: 'ultra-t-special-provisional-fire', kind: 'special', element: 'fire', value: 4, color: 3, animation: 'ninja-cut', artKey: 'card-fire-4' },
        { id: 'ultra-t-special-provisional-water', kind: 'special', element: 'water', value: 5, color: 0, animation: 'snow-freeze', artKey: 'card-water-5' },
    ],
};

export function getHeroSpecials(heroId: string): readonly CardDefinition[] {
    const specials = HERO_SPECIALS[heroId];
    if (!specials) throw new Error(`No special cards are configured for hero "${heroId}".`);
    return specials;
}
