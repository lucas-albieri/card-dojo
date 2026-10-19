import type { MonsterDef } from '../../core/types';
import { ultraT } from './ultra-t';

export const MONSTERS: readonly MonsterDef[] = [ultraT];

export function getMonster(monsterId: string): MonsterDef {
    const monster = MONSTERS.find(candidate => candidate.id === monsterId);
    if (!monster) throw new Error(`Unknown monster "${monsterId}".`);
    return monster;
}
