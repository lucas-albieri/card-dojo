import Phaser from 'phaser';
import { type Card, COLORS, ELEMENTS } from '../core/types';
import { addPhosphorIcon, elementPhosphorIcon } from './phosphor-icons';

// Carta pequena das cartas ganhas (canto superior).
export function createMiniCard(scene: Phaser.Scene, x: number, y: number, card: Card, scale = 1) {
    const cardArt = card.artKey && scene.textures.exists(card.artKey)
        ? scene.add.image(0, 0, card.artKey).setDisplaySize(36, 36)
        : undefined;
    const children: Phaser.GameObjects.GameObject[] = [];
    if (cardArt) {
        children.push(cardArt);
    } else {
        const g = scene.add.graphics();
        g.fillStyle(0xffffff).fillRoundedRect(-15, -20, 30, 40, 5);
        g.fillStyle(COLORS[card.color]).fillRoundedRect(-15, -20, 30, 9, { tl: 5, tr: 5, bl: 0, br: 0 });
        g.lineStyle(2, ELEMENTS[card.element].tint).strokeRoundedRect(-15, -20, 30, 40, 5);
        const icon = addPhosphorIcon(scene, elementPhosphorIcon(card.element), 0, 3, 18, ELEMENTS[card.element].tint);
        children.push(g, icon);
    }
    const mini = scene.add.container(x, y, children).setScale(0);
    scene.tweens.add({ targets: mini, scale, duration: 220, ease: 'Back.easeOut' });
    return mini;
}