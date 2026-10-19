import Phaser from 'phaser';
import { getGameSave, updateGameSettings } from '../storage/local-save';

// Efeitos: public/assets/audio/sfx/<nome>.ogg e .mp3 (o navegador usa o primeiro que souber tocar)
export const SFX = [
    'card-flip', 'card-play', 'round-win', 'round-lose', 'round-draw',
    'fire-burst', 'water-splash', 'plant-rustle', 'match-win', 'match-lose', 'ui-click',
] as const;
export type SfxKey = (typeof SFX)[number];

// Músicas: public/assets/audio/music/<nome>.ogg e .mp3.
// Quando tiver os arquivos, liste os nomes aqui. Ex.: ['title', 'battle']
export const MUSIC: readonly string[] = [];

// Som de cada elemento (as chaves seguem o ElementType do jogo)
const ELEMENT_SFX: Record<string, SfxKey> = {
    fire: 'fire-burst',
    water: 'water-splash',
    plant: 'plant-rustle',
};
export const elementSfx = (element: string): SfxKey | undefined => ELEMENT_SFX[element];

const savedSettings = getGameSave().settings;
const volume = { sfx: savedSettings.sfxVolume, music: savedSettings.musicVolume };
let musicEnabled = savedSettings.musicEnabled;
let music: Phaser.Sound.BaseSound | null = null;
let musicKey: string | null = null;
let requestedMusic: { scene: Phaser.Scene; key: string; fadeMs: number } | null = null;
const clampVolume = (value: number) => Math.max(0, Math.min(1, value));

type Volumed = Phaser.Sound.BaseSound & { setVolume?: (v: number) => unknown };
const setVol = (s: Phaser.Sound.BaseSound, v: number) => (s as Volumed).setVolume?.(v);

// Chamar uma vez, no preload da cena de boot.
export function preloadAudio(scene: Phaser.Scene) {
    scene.sound.mute = getGameSave().settings.muted;
    for (const key of SFX) {
        scene.load.audio(key, [`/assets/audio/sfx/${key}.ogg`, `/assets/audio/sfx/${key}.mp3`]);
    }
    for (const key of MUSIC) {
        scene.load.audio(key, [`/assets/audio/music/${key}.ogg`, `/assets/audio/music/${key}.mp3`]);
    }
}

// vary: muda levemente o tom, para sons repetidos (como virar carta) não cansarem.
export function playSfx(scene: Phaser.Scene, key: SfxKey, opts: { volume?: number; vary?: boolean } = {}) {
    if (!scene.cache.audio.exists(key)) return;
    scene.sound.play(key, {
        volume: volume.sfx * (opts.volume ?? 1),
        rate: opts.vary ? 0.94 + Math.random() * 0.12 : 1,
    });
}

// A música continua tocando ao trocar de cena. Se já é a mesma, não reinicia.
// Antes do primeiro clique o navegador bloqueia o áudio; o Phaser guarda o pedido e toca quando liberar.
export function playMusic(scene: Phaser.Scene, key: string, fadeMs = 400) {
    requestedMusic = { scene, key, fadeMs };
    if (!musicEnabled) return;
    if (musicKey === key) return;
    stopMusic(fadeMs, false);
    if (!scene.cache.audio.exists(key)) return;
    musicKey = key;
    music = scene.sound.add(key, { loop: true, volume: volume.music });
    music.play();
}

export function stopMusic(fadeMs = 400, clearRequest = true) {
    if (clearRequest) requestedMusic = null;
    const old = music;
    music = null;
    musicKey = null;
    if (!old) return;
    if (fadeMs <= 0) {
        old.stop();
        old.destroy();
        return;
    }
    const steps = Math.max(1, Math.round(fadeMs / 40));
    let i = 0;
    const id = setInterval(() => {
        i++;
        setVol(old, volume.music * (1 - i / steps));
        if (i >= steps) {
            clearInterval(id);
            old.stop();
            old.destroy();
        }
    }, 40);
}

export function setSfxVolume(v: number) {
    volume.sfx = clampVolume(v);
    updateGameSettings({ sfxVolume: volume.sfx });
}

export function setMusicVolume(v: number) {
    volume.music = clampVolume(v);
    updateGameSettings({ musicVolume: volume.music });
    if (music) setVol(music, volume.music);
}

export function getSfxVolume() {
    return volume.sfx;
}

export function getMusicVolume() {
    return volume.music;
}

export function getMusicEnabled() {
    return musicEnabled;
}

export function setMusicEnabled(enabled: boolean) {
    musicEnabled = enabled;
    updateGameSettings({ musicEnabled: enabled });
    if (!enabled) stopMusic(400, false);
    else if (requestedMusic) {
        const { scene, key, fadeMs } = requestedMusic;
        playMusic(scene, key, fadeMs);
    }
}

export function toggleMute(scene: Phaser.Scene): boolean {
    scene.sound.mute = !scene.sound.mute;
    updateGameSettings({ muted: scene.sound.mute });
    return scene.sound.mute;
}