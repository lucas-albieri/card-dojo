import type { CardDefinition, TowerDef } from './types';

export interface TowerRun {
    towerId: string;
    heroId: string;
    floorIndex: number;
    earnedSpecials: CardDefinition[];
}

export type TowerAdvance =
    | { status: 'run-failed'; run: TowerRun }
    | { status: 'next-floor'; run: TowerRun }
    | { status: 'tower-cleared'; run: TowerRun };

export function startTowerRun(tower: TowerDef, heroId: string): TowerRun {
    if (tower.floors.length === 0) throw new Error(`Tower "${tower.id}" has no floors.`);
    if (!tower.rewardPoolsByHero[heroId]) {
        throw new Error(`Tower "${tower.id}" has no reward pool for hero "${heroId}".`);
    }
    return { towerId: tower.id, heroId, floorIndex: 0, earnedSpecials: [] };
}

export function getCurrentOpponent(tower: TowerDef, run: TowerRun) {
    if (run.towerId !== tower.id) throw new Error(`Run "${run.towerId}" does not belong to tower "${tower.id}".`);
    const opponent = tower.floors[run.floorIndex];
    if (!opponent) throw new Error(`Tower run "${run.towerId}" has no opponent at floor ${run.floorIndex}.`);
    return opponent;
}

export function getTowerRewardOptions(
    pool: readonly CardDefinition[],
    run: TowerRun,
    random: () => number = Math.random,
): CardDefinition[] {
    const earnedIds = new Set(run.earnedSpecials.map(card => card.id));
    const available = pool.filter(card => !earnedIds.has(card.id));
    for (let index = available.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(random() * (index + 1));
        [available[index], available[swapIndex]] = [available[swapIndex], available[index]];
    }
    return available.slice(0, 3).map(card => ({ ...card }));
}

export function chooseTowerReward(
    run: TowerRun,
    card: CardDefinition,
    pool: readonly CardDefinition[],
): TowerRun {
    if (!pool.some(candidate => candidate.id === card.id)) {
        throw new Error(`Card "${card.id}" is not in this hero's reward pool.`);
    }
    if (run.earnedSpecials.some(earned => earned.id === card.id)) {
        throw new Error(`Card "${card.id}" has already been chosen in this run.`);
    }
    return { ...run, earnedSpecials: [...run.earnedSpecials, { ...card }] };
}

export function getTowerBattleDeck(
    basicDeck: readonly CardDefinition[],
    run: TowerRun,
): CardDefinition[] {
    if (basicDeck.length === 0) throw new Error('A tower battle requires at least one basic card.');
    return [...basicDeck, ...run.earnedSpecials].map(card => ({ ...card }));
}

export function advanceTowerRun(run: TowerRun, tower: TowerDef, won: boolean): TowerAdvance {
    getCurrentOpponent(tower, run);
    if (!won) return { status: 'run-failed', run: { ...run, earnedSpecials: [...run.earnedSpecials] } };
    if (run.floorIndex === tower.floors.length - 1) {
        return { status: 'tower-cleared', run: { ...run, earnedSpecials: [...run.earnedSpecials] } };
    }
    return {
        status: 'next-floor',
        run: { ...run, floorIndex: run.floorIndex + 1, earnedSpecials: [...run.earnedSpecials] },
    };
}
