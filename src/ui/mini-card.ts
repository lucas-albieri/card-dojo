import Phaser from 'phaser';
import { type Card, COLORS, ELEMENTS } from '../core/types';

// Carta pequena das cartas ganhas (canto superior).
export function createMiniCard(scene: Phaser.Scene, x: number, y: number, card: Card, scale = 1) {
    const g = scene.add.graphics();
    g.fillStyle(0xffffff).fillRoundedRect(-15, -20, 30, 40, 5);
    g.fillStyle(COLORS[card.color]).fillRoundedRect(-15, -20, 30, 9, { tl: 5, tr: 5, bl: 0, br: 0 });
    g.lineStyle(2, ELEMENTS[card.element].tint).strokeRoundedRect(-15, -20, 30, 40, 5);
    const icon = scene.add.text(0, 3, ELEMENTS[card.element].icon, { fontSize: '18px' }).setOrigin(0.5);
    const mini = scene.add.container(x, y, [g, icon]).setScale(0);
    scene.tweens.add({ targets: mini, scale, duration: 220, ease: 'Back.easeOut' });
    return mini;
}