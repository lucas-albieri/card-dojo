import { getGameSave, updateGameSettings } from './storage/local-save';

export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;
export const FONT = "Fredoka, 'Trebuchet MS', system-ui, sans-serif";
export let REDUCED_MOTION = getGameSave().settings.reducedMotion;

export function setReducedMotion(enabled: boolean) {
	REDUCED_MOTION = enabled;
	updateGameSettings({ reducedMotion: enabled });
}