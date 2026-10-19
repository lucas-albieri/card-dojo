import Phaser from 'phaser';
import { FONT, REDUCED_MOTION } from '../config';
import { playSfx } from './audio';
import { addPhosphorIcon, type PhosphorIcon } from './phosphor-icons';

export function createMenuButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    onPress: () => void,
    primary = false,
    compact = false,
    icon?: PhosphorIcon,
): Phaser.GameObjects.Container {
    const fill = compact ? 0x15131c : primary ? 0xbaff39 : 0x1a201b;
    const stroke = compact ? 0x8e78aa : primary ? 0xd5ff83 : 0x8e78aa;
    const fillAlpha = compact ? 0.82 : 1;
    const background = scene.add.rectangle(0, 0, width, height, fill, fillAlpha)
        .setStrokeStyle(compact ? 2 : 3, stroke, compact ? 0.8 : 1);
    const text = scene.add.text(0, 0, label, {
        fontFamily: FONT,
        fontStyle: '700',
        fontSize: compact ? '21px' : '40px',
        color: compact ? '#e1dce8' : primary ? '#11170d' : '#f4f1fa',
    }).setOrigin(0.5).setVisible(!icon || width >= 150);
    const children: Phaser.GameObjects.GameObject[] = [background, text];
    if (icon) {
        const iconSize = compact ? Math.min(28, height * 0.58) : Math.min(36, height * 0.48);
        const iconX = width < 150 ? 0 : -width / 2 + Math.max(height * 0.62, iconSize);
        const iconTint = primary ? 0x11170d : 0xf4f1fa;
        children.push(addPhosphorIcon(scene, icon, iconX, 0, iconSize, iconTint, 0));
        if (width >= 150) text.setX(compact ? 27 : width * 0.14);
    }
    const button = scene.add.container(x, y, children);

    background.setInteractive({ useHandCursor: true });
    background.on('pointerover', () => {
        background.setFillStyle(compact ? 0x30273d : primary ? 0xd5ff83 : 0x303a31);
        scene.tweens.killTweensOf(button);
        if (!REDUCED_MOTION) scene.tweens.add({ targets: button, scale: 1.035, duration: 140, ease: 'Sine.easeOut' });
    });
    background.on('pointerout', () => {
        background.setFillStyle(fill, fillAlpha);
        scene.tweens.killTweensOf(button);
        if (REDUCED_MOTION) button.setScale(1);
        else scene.tweens.add({ targets: button, scale: 1, duration: 140, ease: 'Sine.easeOut' });
    });
    background.on('pointerdown', () => {
        playSfx(scene, 'ui-click');
        onPress();
    });

    return button;
}