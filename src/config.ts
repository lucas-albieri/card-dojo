export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;
export const FONT = "Fredoka, 'Trebuchet MS', system-ui, sans-serif";
const reducedMotionPreference = window.localStorage.getItem('card-dojo-reduced-motion');
export let REDUCED_MOTION = reducedMotionPreference === null
	? window.matchMedia('(prefers-reduced-motion: reduce)').matches
	: reducedMotionPreference === 'true';

export function setReducedMotion(enabled: boolean) {
	REDUCED_MOTION = enabled;
	window.localStorage.setItem('card-dojo-reduced-motion', String(enabled));
}