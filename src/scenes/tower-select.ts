import Phaser from 'phaser';
import { FONT, GAME_HEIGHT as H, GAME_WIDTH as W } from '../config';
import { getUnlockedTowerIds } from '../core/progress';
import { TOWERS } from '../data/towers/towers';
import { getGameSave } from '../storage/local-save';
import { createMenuButton } from '../ui/menu-button';
import { addPhosphorIcon } from '../ui/phosphor-icons';

export class TowerSelect extends Phaser.Scene {
    constructor() {
        super('tower-select');
    }

    create() {
        this.cameras.main.setBackgroundColor('#10170f');
        this.add.text(W / 2, H * 0.13, 'ESCOLHA A TORRE', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '76px',
            color: '#f7f6f2',
        }).setOrigin(0.5);
        const progress = getGameSave().progress.towers;
        const unlocked = new Set([
            ...progress.unlockedTowerIds,
            ...getUnlockedTowerIds(TOWERS, progress.clearedTowerIds),
        ]);
        const xs = [W * 0.25, W * 0.5, W * 0.75];

        TOWERS.forEach((tower, index) => {
            const isUnlocked = unlocked.has(tower.id);
            const x = xs[index];
            const frame = this.add.rectangle(x, H * 0.48, 400, 430, isUnlocked ? 0x1c241a : 0x17181d, 0.96)
                .setStrokeStyle(isUnlocked ? 4 : 2, isUnlocked ? 0xbaff39 : 0x5b5267, 1);
            addPhosphorIcon(this, isUnlocked ? 'stairs' : 'lock-key', x, H * 0.43, 100, isUnlocked ? 0xbaff39 : 0x8b70a7, 2);
            this.add.text(x, H * 0.62, isUnlocked ? tower.name : '???', {
                fontFamily: FONT,
                fontStyle: '700',
                fontSize: '38px',
                color: isUnlocked ? '#f7f6f2' : '#a58fb8',
            }).setOrigin(0.5);
            this.add.text(x, H * 0.69, isUnlocked ? `${tower.floors.length - 1} ANDARES + BOSS` : 'BLOQUEADA', {
                fontFamily: FONT,
                fontStyle: '700',
                fontSize: '21px',
                color: isUnlocked ? '#baff39' : '#a58fb8',
            }).setOrigin(0.5);
            if (isUnlocked) {
                frame.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
                    this.scene.start('monster-select', { towerId: tower.id });
                });
            }
        });
        createMenuButton(this, W / 2, H * 0.88, 220, 62, 'VOLTAR', () => {
            this.scene.start('mode-select');
        }, false, true, 'arrow-left');
    }
}
