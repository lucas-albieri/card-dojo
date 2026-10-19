import { createTowerProgress, type TowerProgress } from '../core/progress';

export interface GameSettings {
    sfxVolume: number;
    musicVolume: number;
    musicEnabled: boolean;
    muted: boolean;
    reducedMotion: boolean;
}

export interface GameProgress {
    unlockedHeroIds: string[];
    selectedHeroId: string;
    storyChapterId: string | null;
    castleId: string | null;
    towers: TowerProgress;
}

export interface GameSave {
    version: 1;
    settings: GameSettings;
    progress: GameProgress;
}

const STORAGE_KEY = 'card-dojo-save-v1';
const LEGACY_STORAGE_KEY = 'card-dojo-save';
const DEFAULT_SAVE: GameSave = {
    version: 1,
    settings: {
        sfxVolume: 0.8,
        musicVolume: 0.5,
        musicEnabled: true,
        muted: false,
        reducedMotion: false,
    },
    progress: {
        unlockedHeroIds: ['ultra-t'],
        selectedHeroId: 'ultra-t',
        storyChapterId: null,
        castleId: null,
        towers: {
            ...createTowerProgress(),
            unlockedTowerIds: ['dojo-tower-1'],
        },
    },
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const validVolume = (value: unknown, fallback: number) =>
    typeof value === 'number' && Number.isFinite(value)
        ? Math.max(0, Math.min(1, value))
        : fallback;

const validId = (value: unknown): value is string =>
    typeof value === 'string' && value.length > 0;

function normalizeSave(value: unknown): GameSave | null {
    if (!isRecord(value) || value.version !== 1) return null;

    const settings = isRecord(value.settings) ? value.settings : {};
    const progress = isRecord(value.progress) ? value.progress : {};
    const storedTowers = isRecord(progress.towers) ? progress.towers : {};
    const unlockedTowerIds = Array.isArray(storedTowers.unlockedTowerIds)
        ? [...new Set(storedTowers.unlockedTowerIds.filter(validId))]
        : [...DEFAULT_SAVE.progress.towers.unlockedTowerIds];
    if (!unlockedTowerIds.includes('dojo-tower-1')) unlockedTowerIds.push('dojo-tower-1');
    const clearedTowerIds = Array.isArray(storedTowers.clearedTowerIds)
        ? [...new Set(storedTowers.clearedTowerIds.filter(validId))]
        : [];
    const bestFloorsByTowerAndHero: Record<string, number> = {};
    if (isRecord(storedTowers.bestFloorsByTowerAndHero)) {
        for (const [key, floor] of Object.entries(storedTowers.bestFloorsByTowerAndHero)) {
            if (typeof floor === 'number' && Number.isInteger(floor) && floor >= 0) bestFloorsByTowerAndHero[key] = floor;
        }
    }
    const unlockedHeroIds = Array.isArray(progress.unlockedHeroIds)
        ? [...new Set(progress.unlockedHeroIds.filter(validId))]
        : [...DEFAULT_SAVE.progress.unlockedHeroIds];
    if (!unlockedHeroIds.includes('ultra-t')) unlockedHeroIds.push('ultra-t');
    const selectedHeroId = validId(progress.selectedHeroId) && unlockedHeroIds.includes(progress.selectedHeroId)
        ? progress.selectedHeroId
        : unlockedHeroIds[0];

    return {
        version: 1,
        settings: {
            sfxVolume: validVolume(settings.sfxVolume, DEFAULT_SAVE.settings.sfxVolume),
            musicVolume: validVolume(settings.musicVolume, DEFAULT_SAVE.settings.musicVolume),
            musicEnabled: typeof settings.musicEnabled === 'boolean'
                ? settings.musicEnabled
                : DEFAULT_SAVE.settings.musicEnabled,
            muted: typeof settings.muted === 'boolean' ? settings.muted : DEFAULT_SAVE.settings.muted,
            reducedMotion: typeof settings.reducedMotion === 'boolean'
                ? settings.reducedMotion
                : DEFAULT_SAVE.settings.reducedMotion,
        },
        progress: {
            unlockedHeroIds,
            selectedHeroId,
            storyChapterId: progress.storyChapterId === null || validId(progress.storyChapterId)
                ? progress.storyChapterId
                : null,
            castleId: progress.castleId === null || validId(progress.castleId)
                ? progress.castleId
                : null,
            towers: { unlockedTowerIds, clearedTowerIds, bestFloorsByTowerAndHero },
        },
    };
}

function readSave(): GameSave {
    let stored: string | null;
    try {
        stored = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
    } catch (error) {
        console.error('Não foi possível ler o progresso salvo do Card Dojo.', error);
        return structuredClone(DEFAULT_SAVE);
    }

    if (stored === null) {
        const initial = structuredClone(DEFAULT_SAVE);
        try {
            const oldReducedMotion = window.localStorage.getItem('card-dojo-reduced-motion');
            initial.settings.reducedMotion = oldReducedMotion === null
                ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
                : oldReducedMotion === 'true';
        } catch (error) {
            console.error('Não foi possível carregar a preferência de movimento reduzido.', error);
        }
        return initial;
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(stored);
    } catch (error) {
        console.warn('O arquivo de progresso do Card Dojo está inválido; as configurações padrão serão usadas.', error);
        return structuredClone(DEFAULT_SAVE);
    }

    const normalized = normalizeSave(parsed);
    if (normalized) return normalized;

    console.warn('A versão do progresso salvo do Card Dojo não é compatível; as configurações padrão serão usadas.');
    return structuredClone(DEFAULT_SAVE);
}

let save = readSave();

function persist() {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
    } catch (error) {
        console.error('Não foi possível salvar as configurações ou o progresso do Card Dojo.', error);
        throw error;
    }
}

export function getGameSave(): GameSave {
    return structuredClone(save);
}

export function updateGameSettings(settings: Partial<GameSettings>) {
    if (
        (settings.sfxVolume !== undefined && (typeof settings.sfxVolume !== 'number' || !Number.isFinite(settings.sfxVolume) || settings.sfxVolume < 0 || settings.sfxVolume > 1))
        || (settings.musicVolume !== undefined && (typeof settings.musicVolume !== 'number' || !Number.isFinite(settings.musicVolume) || settings.musicVolume < 0 || settings.musicVolume > 1))
        || (settings.musicEnabled !== undefined && typeof settings.musicEnabled !== 'boolean')
        || (settings.muted !== undefined && typeof settings.muted !== 'boolean')
        || (settings.reducedMotion !== undefined && typeof settings.reducedMotion !== 'boolean')
    ) {
        throw new TypeError('As configurações informadas para o Card Dojo são inválidas.');
    }
    const updated = normalizeSave({ ...save, settings: { ...save.settings, ...settings } });
    if (!updated) throw new Error('As configurações informadas para o Card Dojo são inválidas.');
    save = updated;
    persist();
}

export function unlockHero(heroId: string) {
    if (!validId(heroId)) throw new TypeError('O identificador do herói precisa ser uma string não vazia.');
    if (save.progress.unlockedHeroIds.includes(heroId)) return;
    save.progress.unlockedHeroIds.push(heroId);
    persist();
}

export function selectHero(heroId: string) {
    if (!save.progress.unlockedHeroIds.includes(heroId)) {
        throw new Error(`O herói "${heroId}" ainda não foi desbloqueado.`);
    }
    save.progress.selectedHeroId = heroId;
    persist();
}

export function updateStoryProgress(progress: Partial<Pick<GameProgress, 'storyChapterId' | 'castleId'>>) {
    if (
        (progress.storyChapterId !== undefined && progress.storyChapterId !== null && !validId(progress.storyChapterId))
        || (progress.castleId !== undefined && progress.castleId !== null && !validId(progress.castleId))
    ) {
        throw new TypeError('O progresso informado para o Card Dojo é inválido.');
    }
    const updated = normalizeSave({ ...save, progress: { ...save.progress, ...progress } });
    if (!updated) throw new Error('O progresso informado para o Card Dojo é inválido.');
    save = updated;
    persist();
}

export function updateTowerProgress(towers: TowerProgress) {
    const updated = normalizeSave({ ...save, progress: { ...save.progress, towers } });
    if (!updated) throw new Error('O progresso das torres informado é inválido.');
    save = updated;
    persist();
}
