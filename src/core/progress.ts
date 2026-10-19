import type { TowerDef } from './types';

export interface TowerProgress {
    unlockedTowerIds: string[];
    clearedTowerIds: string[];
    bestFloorsByTowerAndHero: Record<string, number>;
}

const progressKey = (towerId: string, heroId: string) => `${towerId}:${heroId}`;

export function createTowerProgress(): TowerProgress {
    return { unlockedTowerIds: [], clearedTowerIds: [], bestFloorsByTowerAndHero: {} };
}

export function getUnlockedTowerIds(towers: readonly TowerDef[], clearedTowerIds: readonly string[]): string[] {
    const cleared = new Set(clearedTowerIds);
    return towers
        .filter(tower => tower.unlock.type === 'default' || cleared.has(tower.unlock.towerId))
        .map(tower => tower.id);
}

export function recordTowerFloor(
    progress: TowerProgress,
    towerId: string,
    heroId: string,
    clearedFloor: number,
): TowerProgress {
    if (!Number.isInteger(clearedFloor) || clearedFloor < 1) {
        throw new RangeError('The cleared floor must be a positive integer.');
    }
    const key = progressKey(towerId, heroId);
    return {
        ...progress,
        unlockedTowerIds: [...progress.unlockedTowerIds],
        clearedTowerIds: [...progress.clearedTowerIds],
        bestFloorsByTowerAndHero: {
            ...progress.bestFloorsByTowerAndHero,
            [key]: Math.max(progress.bestFloorsByTowerAndHero[key] ?? 0, clearedFloor),
        },
    };
}

export function recordTowerClear(
    progress: TowerProgress,
    towerId: string,
    heroId: string,
    tower: TowerDef,
    towers: readonly TowerDef[],
): TowerProgress {
    if (tower.id !== towerId) throw new Error(`Tower "${tower.id}" does not match "${towerId}".`);
    const clearedTowerIds = [...new Set([...progress.clearedTowerIds, towerId])];
    return {
        ...recordTowerFloor(progress, towerId, heroId, tower.floors.length),
        clearedTowerIds,
        unlockedTowerIds: getUnlockedTowerIds(towers, clearedTowerIds),
    };
}
