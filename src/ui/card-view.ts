import Phaser from 'phaser';
import { FONT } from '../config';
import { type Card, COLORS, ELEMENTS } from '../core/types';
import { tween } from './util';
import { addPhosphorIcon, elementPhosphorIcon } from './phosphor-icons';

// O tamanho final vem do setScale (ver layout.ts).
export class CardView extends Phaser.GameObjects.Container {
    readonly card: Card;
    private front: Phaser.GameObjects.Container;
    private back: Phaser.GameObjects.Container;

    constructor (scene: Phaser.Scene, x: number, y: number, card: Card, faceUp = true) {
        super(scene, x, y);
        this.card = card;
        const info = ELEMENTS[card.element];
        const artKey = card.artKey && scene.textures.exists(card.artKey) ? card.artKey : undefined;
        const cardWidth = 160;
        const cardHeight = 160;
        const art = artKey ? scene.add.image(0, 0, artKey).setDisplaySize(cardWidth, cardHeight) : undefined;
        const border = scene.add.graphics();
        if (!art) {
            border.fillStyle(0xf06d4d).fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 18);
            border.fillStyle(0x0b2a4a, 0.18).fillRoundedRect(-cardWidth / 2 + 5, -cardHeight / 2 + 5, cardWidth - 10, cardHeight - 10, 14);
            border.lineStyle(6, 0x000000, 1).strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 18);
        }

        const badgeBg = art ? undefined : scene.add.graphics();
        if (badgeBg) {
            badgeBg.fillStyle(0xffffff, 0.96).fillRoundedRect(-52, -cardHeight / 2 + 12, 72, 34, 12);
            badgeBg.fillStyle(COLORS[card.color], 0.98).fillRoundedRect(-48, -cardHeight / 2 + 16, 28, 26, 8);
        }
        const typeIcon = art ? undefined : addPhosphorIcon(scene, elementPhosphorIcon(card.element), -34, -cardHeight / 2 + 29, 22, info.tint);
        const typeGlow = art ? undefined : scene.add.ellipse(-18, -cardHeight / 2 + 29, 26, 18, 0xffffff, 0.18);
        const value = art ? undefined : scene.add.text(0, 4, String(card.value), {
            fontFamily: FONT,
            fontSize: '46px',
            fontStyle: '700',
            color: '#0c1d2d',
            stroke: '#ffffff',
            strokeThickness: 9,
        }).setOrigin(0.5);

        const valueShadow = art ? undefined : scene.add.text(2, 6, String(card.value), {
            fontFamily: FONT,
            fontSize: '46px',
            fontStyle: '700',
            color: '#000000',
        }).setOrigin(0.5).setAlpha(0.14);

        const frontChildren: Phaser.GameObjects.GameObject[] = [];
        if (art) {
            frontChildren.push(art);
        } else {
            frontChildren.push(border);
            if (badgeBg) frontChildren.push(badgeBg);
            if (typeGlow) frontChildren.push(typeGlow);
            if (typeIcon) frontChildren.push(typeIcon);
            if (valueShadow) frontChildren.push(valueShadow);
            if (value) frontChildren.push(value);
        }
        this.front = scene.add.container(0, 0, frontChildren);

        const b = scene.add.graphics();
        b.fillStyle(0xf06d4d).fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 18);
        b.fillStyle(0x16467a).fillRoundedRect(-cardWidth / 2 + 5, -cardHeight / 2 + 5, cardWidth - 10, cardHeight - 10, 14);
        b.lineStyle(6, 0xffffff).strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 18);
        b.lineStyle(3, 0x8fd3f2).strokeCircle(0, 0, 30);
        const q = addPhosphorIcon(scene, 'question', 0, 0, 40, 0x8fd3f2);
        this.back = scene.add.container(0, 0, [b, q]);

        this.front.setVisible(faceUp);
        this.back.setVisible(!faceUp);
        this.add([this.front, this.back]);
        this.setSize(cardWidth, cardHeight);
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