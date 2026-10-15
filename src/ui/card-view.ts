import Phaser from 'phaser';
import { FONT } from '../config';
import { type Card, COLORS, ELEMENTS } from '../core/types';
import { tween } from './util';

// Carta visual desenhada em 110x150. O tamanho final vem do setScale (ver layout.ts).
export class CardView extends Phaser.GameObjects.Container {
    readonly card: Card;
    private front: Phaser.GameObjects.Container;
    private back: Phaser.GameObjects.Container;

    constructor (scene: Phaser.Scene, x: number, y: number, card: Card, faceUp = true) {
        super(scene, x, y);
        this.card = card;
        const info = ELEMENTS[card.element];

        const cardHeight = 140;
        const border = scene.add.graphics();
        border.fillStyle(0xf06d4d).fillRoundedRect(-55, -cardHeight / 2, 110, cardHeight, 18);
        border.fillStyle(0x0b2a4a, 0.18).fillRoundedRect(-50, -cardHeight / 2 + 5, 100, cardHeight - 10, 14);
        border.lineStyle(6, 0x000000, 1).strokeRoundedRect(-55, -cardHeight / 2, 110, cardHeight, 18);

        const badgeBg = scene.add.graphics();
        badgeBg.fillStyle(0xffffff, 0.96).fillRoundedRect(-52, -cardHeight / 2 + 12, 72, 34, 12);
        badgeBg.fillStyle(COLORS[card.color], 0.98).fillRoundedRect(-48, -cardHeight / 2 + 16, 28, 26, 8);
        const typeIcon = scene.add.text(-34, -cardHeight / 2 + 29, info.icon, { fontSize: '22px' }).setOrigin(0.5);
        const typeGlow = scene.add.ellipse(-18, -cardHeight / 2 + 29, 26, 18, 0xffffff, 0.18);

        const value = scene.add.text(0, 4, String(card.value), {
            fontFamily: FONT,
            fontSize: '46px',
            fontStyle: '700',
            color: '#0c1d2d',
            stroke: '#ffffff',
            strokeThickness: 9,
        }).setOrigin(0.5);

        const valueShadow = scene.add.text(2, 6, String(card.value), {
            fontFamily: FONT,
            fontSize: '46px',
            fontStyle: '700',
            color: '#000000',
        }).setOrigin(0.5).setAlpha(0.14);

        this.front = scene.add.container(0, 0, [border, badgeBg, typeGlow, typeIcon, valueShadow, value]);

        const b = scene.add.graphics();
        b.fillStyle(0xf06d4d).fillRoundedRect(-55, -cardHeight / 2, 110, cardHeight, 18);
        b.fillStyle(0x16467a).fillRoundedRect(-50, -cardHeight / 2 + 5, 100, cardHeight - 10, 14);
        b.lineStyle(6, 0xffffff).strokeRoundedRect(-55, -cardHeight / 2, 110, cardHeight, 18);
        b.lineStyle(3, 0x8fd3f2).strokeCircle(0, 0, 30);
        const q = scene.add.text(0, 0, '?', { fontFamily: FONT, fontSize: '40px', fontStyle: '700', color: '#8fd3f2' }).setOrigin(0.5);
        this.back = scene.add.container(0, 0, [b, q]);

        this.front.setVisible(faceUp);
        this.back.setVisible(!faceUp);
        this.add([this.front, this.back]);
        this.setSize(110, cardHeight);
        scene.add.existing(this);
    }

    async flip(faceUp: boolean) {
        const s = this.scaleY;
        await tween(this.scene, { targets: this, scaleX: 0, duration: 140 });
        this.front.setVisible(faceUp);
        this.back.setVisible(!faceUp);
        await tween(this.scene, { targets: this, scaleX: s, duration: 140 });
    }
}