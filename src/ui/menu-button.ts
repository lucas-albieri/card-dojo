import Phaser from 'phaser';
import { FONT } from '../config';

export function createMenuButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    onPress: () => void,
    primary = false,
): Phaser.GameObjects.Container {
    const fill = primary ? 0xbaff39 : 0x1a201b;
    const stroke = primary ? 0xd5ff83 : 0x8e78aa;
    const background = scene.add.rectangle(0, 0, width, height, fill).setStrokeStyle(3, stroke);
    const text = scene.add.text(0, 0, label, {
        fontFamily: FONT,
        fontStyle: '700',
        fontSize: '40px',
        color: primary ? '#11170d' : '#f4f1fa',
    }).setOrigin(0.5);
    const button = scene.add.container(x, y, [background, text]);

    background.setInteractive({ useHandCursor: true });
    background.on('pointerover', () => background.setFillStyle(primary ? 0xd5ff83 : 0x303a31));
    background.on('pointerout', () => background.setFillStyle(fill));
    background.on('pointerdown', onPress);

    return button;
}