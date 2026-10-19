import Phaser from 'phaser';
import { FONT, GAME_HEIGHT as H, GAME_WIDTH as W } from '../config';
import { chooseTowerReward, getTowerRewardOptions, type TowerRun } from '../core/tower';
import { ELEMENTS } from '../core/types';
import { getHeroSpecials } from '../data/towers/specials';
import { getTower } from '../data/towers/towers';
import { CardView } from '../ui/card-view';
import { createMenuButton } from '../ui/menu-button';
import { addPhosphorIcon, elementPhosphorIcon } from '../ui/phosphor-icons';

export class Reward extends Phaser.Scene {
    constructor() {
        super('reward');
    }

    create(data: { towerId: string; run: TowerRun }) {
        const tower = getTower(data.towerId);
        const poolIds = new Set(tower.rewardPoolsByHero[data.run.heroId] ?? []);
        const pool = getHeroSpecials(data.run.heroId).filter(card => poolIds.has(card.id));
        const options = getTowerRewardOptions(pool, data.run);
        const floorCount = tower.floors.length;

        this.cameras.main.setBackgroundColor('#10170f');
        addPhosphorIcon(this, 'gift', W / 2, H * 0.17, 64, 0xbaff39, 2);
        this.add.text(W / 2, H * 0.26, 'ESCOLHA UMA CARTA ESPECIAL', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '56px',
            color: '#f7f6f2',
        }).setOrigin(0.5);
        this.add.text(W / 2, H * 0.33, 'Adicione a carta escolhida ao seu baralho da corrida.', {
            fontFamily: FONT,
            fontSize: '24px',
            color: '#bba9d0',
        }).setOrigin(0.5);

        if (options.length === 0) {
            this.add.text(W / 2, H * 0.51, 'Todas as cartas desta recompensa já foram obtidas.', {
                fontFamily: FONT,
                fontSize: '32px',
                color: '#f7f6f2',
            }).setOrigin(0.5);
            createMenuButton(this, W / 2, H * 0.72, 380, 82, 'CONTINUAR', () => {
                this.scene.start('tower-run', { towerId: tower.id, run: data.run });
            }, true, false, 'arrow-right');
            return;
        }

        const xs = options.length === 1 ? [W / 2] : options.length === 2 ? [W * 0.38, W * 0.62] : [W * 0.29, W * 0.5, W * 0.71];
        options.forEach((card, index) => {
            const x = xs[index];
            const cardView = new CardView(this, x, H * 0.52, card, true).setScale(1.45);
            cardView.setInteractive({ useHandCursor: true });
            cardView.on('pointerover', () => cardView.setScale(1.55));
            cardView.on('pointerout', () => cardView.setScale(1.45));
            cardView.on('pointerdown', () => {
                const run = chooseTowerReward(data.run, card, pool);
                this.scene.start('tower-run', { towerId: tower.id, run });
            });
            const color = ELEMENTS[card.element].tint;
            addPhosphorIcon(this, elementPhosphorIcon(card.element), x - 28, H * 0.76, 24, color);
            this.add.text(x + 7, H * 0.76, `${card.element.toUpperCase()} · ${card.value}`, {
                fontFamily: FONT,
                fontStyle: '700',
                fontSize: '25px',
                color: '#f7f6f2',
            }).setOrigin(0.5);
        });
        this.add.text(W / 2, H * 0.9, `Próximo: ${data.run.floorIndex < floorCount ? `andar ${data.run.floorIndex + 1}` : 'boss'}`, {
            fontFamily: FONT,
            fontSize: '24px',
            color: '#bba9d0',
        }).setOrigin(0.5);
    }
}
