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

        const f = scene.add.graphics();
        f.fillStyle(0x0b2a4a, 0.25).fillRoundedRect(-51, -69, 110, 150, 14);
        f.fillStyle(0xffffff).fillRoundedRect(-55, -75, 110, 150, 14);
        f.fillStyle(COLORS[card.color]).fillRoundedRect(-55, -75, 110, 30, { tl: 14, tr: 14, bl: 0, br: 0 });
        f.lineStyle(5, info.tint).strokeRoundedRect(-55, -75, 110, 150, 14);
        const label = scene.add.text(0, -60, info.label, { fontFamily: FONT, fontSize: '17px', fontStyle: '700', color: '#ffffff' }).setOrigin(0.5);
        const icon = scene.add.text(0, -4, info.icon, { fontSize: '25px' }).setOrigin(0.5);
        const value = scene.add.text(0, 47, String(card.value), { fontFamily: FONT, fontSize: '38px', fontStyle: '700', color: '#12324f' }).setOrigin(0.5);
        this.front = scene.add.container(0, 0, [f, label, icon, value]);

        const b = scene.add.graphics();
        b.fillStyle(0x0b2a4a, 0.25).fillRoundedRect(-51, -69, 110, 150, 14);
        b.fillStyle(0x16467a).fillRoundedRect(-55, -75, 110, 150, 14);
        b.lineStyle(5, 0xffffff).strokeRoundedRect(-55, -75, 110, 150, 14);
        b.lineStyle(3, 0x8fd3f2).strokeCircle(0, 0, 30);
        const q = scene.add.text(0, 0, '?', { fontFamily: FONT, fontSize: '40px', fontStyle: '700', color: '#8fd3f2' }).setOrigin(0.5);
        this.back = scene.add.container(0, 0, [b, q]);

        this.front.setVisible(faceUp);
        this.back.setVisible(!faceUp);
        this.add([this.front, this.back]);
        this.setSize(110, 150);
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