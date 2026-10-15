import Phaser from 'phaser';
import { GAME_WIDTH as W, GAME_HEIGHT as H, FONT, REDUCED_MOTION } from '../config';
import { LAYOUT } from '../layout';
import { type Card, ELEMENTS, type ElementInfo } from '../core/types';
import { createCard } from '../core/deck';
import { compareCards, hasWon } from '../core/rules';
import { chooseCard } from '../ai/opponent';
import { CardView } from '../ui/card-view';
import { createMiniCard } from '../ui/mini-card';
import { createDojoBackground } from '../ui/dojo-background';
import { Fighter } from '../ui/fighter';
import { tween, wait } from '../ui/util';

export class Battle extends Phaser.Scene {
    private busy = false;
    private over = false;
    private mine: Card[] = [];
    private theirs: Card[] = [];
    private hand: (CardView | null)[] = [];
    private foeHand: Card[] = [];
    private foeBacks: (CardView | null)[] = [];
    private status!: Phaser.GameObjects.Text;
    private tintLayer!: Phaser.GameObjects.Rectangle;
    private playerFighter!: Fighter;
    private foeFighter!: Fighter;

    constructor () {
        super('battle');
    }

    create() {
        this.busy = false;
        this.over = false;
        this.mine = [];
        this.theirs = [];
        this.hand = [];
        this.foeBacks = [];
        this.foeHand = Array.from({ length: 5 }, createCard);

        if (!this.textures.exists('dot')) {
            const g = this.make.graphics({ x: 0, y: 0 }, false);
            g.fillStyle(0xffffff).fillCircle(6, 6, 6);
            g.generateTexture('dot', 12, 12);
            g.destroy();
        }

        createDojoBackground(this);
        this.tintLayer = this.add.rectangle(W / 2, H / 2, W, H, 0xffffff).setAlpha(0).setDepth(-5);

        this.playerFighter = new Fighter(this, LAYOUT.fighterLeftX, LAYOUT.fighterY, { skin: 0x66b34a, shell: 0x7a5a2b, plastron: 0xf1e0a0, accent: 0x2f6fdf, facing: 1 }, LAYOUT.fighterScale);
        this.playerFighter.setDepth(-2);
        this.foeFighter = new Fighter(this, LAYOUT.fighterRightX, LAYOUT.fighterY, { skin: 0x4e9a7a, shell: 0x5b4a3a, plastron: 0xe6d6a8, accent: 0xf29b1d, facing: -1 }, LAYOUT.fighterScale);
        this.foeFighter.setDepth(-2);

        const label = { fontFamily: FONT, fontStyle: '700', color: '#ffffff', stroke: '#4a2e1a', strokeThickness: 8 };
        this.status = this.add.text(W / 2, LAYOUT.statusY, 'Escolha uma carta', { ...label, fontSize: '56px' }).setOrigin(0.5);
        this.add.text(40, LAYOUT.handY, 'Você', { ...label, fontSize: '52px' }).setOrigin(0, 0.5);
        this.add.text(W - 40, LAYOUT.handY, 'Oponente', { ...label, fontSize: '44px' }).setOrigin(1, 0.5);

        for (let i = 0; i < 5; i++) {
            this.dealCard(i, i * 70);
            this.spawnFoeBack(i, i * 70);
        }
    }

    private dealCard(i: number, delay = 0) {
        const x = LAYOUT.handStartX + i * LAYOUT.handGap;
        const y = LAYOUT.handY;
        const view = new CardView(this, x, y, createCard(), true);
        view.setInteractive({ useHandCursor: true });
        view.on('pointerover', () => {
            if (!this.busy && !this.over && view.input) this.tweens.add({ targets: view, y: y - 20, duration: 90 });
        });
        view.on('pointerout', () => {
            if (view.input) this.tweens.add({ targets: view, y, duration: 90 });
        });
        view.on('pointerdown', () => this.play(i));
        this.hand[i] = view;
        view.setScale(0);
        this.tweens.add({ targets: view, scale: LAYOUT.handScale, duration: 260, delay, ease: 'Back.easeOut' });
    }

    private spawnFoeBack(i: number, delay = 0) {
        const x = LAYOUT.foeBackStartX - i * LAYOUT.foeBackGap;
        const back = new CardView(this, x, LAYOUT.handY, this.foeHand[i], false);
        back.setScale(0);
        this.tweens.add({ targets: back, scale: LAYOUT.foeBackScale, duration: 260, delay, ease: 'Back.easeOut' });
        this.foeBacks[i] = back;
    }

    private burst(x: number, y: number, info: ElementInfo) {
        const p = this.add.particles(x, y, 'dot', {
            ...info.fx, angle: { min: 0, max: 360 }, lifespan: 900, scale: { start: 2.2, end: 0 }, tint: info.tint, emitting: false,
        }).setDepth(20);
        p.explode(36);
        this.time.delayedCall(1100, () => p.destroy());
    }

    private flash(color: number) {
        this.tintLayer.setFillStyle(color).setAlpha(0.35);
        this.tweens.add({ targets: this.tintLayer, alpha: 0, duration: 800 });
    }

    private async play(i: number) {
        if (this.busy || this.over) return;
        this.busy = true;

        const mine = this.hand[i]!;
        this.hand[i] = null;
        mine.disableInteractive();
        this.tweens.killTweensOf(mine);
        mine.setDepth(10);

        // o oponente joga a carta de uma das cartas viradas dele
        const j = chooseCard(this.foeHand);
        const foeCard = this.foeHand[j];
        const back = this.foeBacks[j]!;
        this.foeBacks[j] = null;
        const foe = new CardView(this, back.x, back.y, foeCard, false);
        foe.setScale(LAYOUT.foeBackScale).setDepth(10);
        back.destroy();
        this.status.setText('');

        await Promise.all([
            tween(this, { targets: mine, x: LAYOUT.arenaPlayerX, y: LAYOUT.arenaY, scale: LAYOUT.arenaScale, duration: 420, ease: 'Back.easeOut' }),
            tween(this, { targets: foe, x: LAYOUT.arenaFoeX, y: LAYOUT.arenaY, scale: LAYOUT.arenaScale, duration: 420, delay: 120, ease: 'Back.easeOut' }),
        ]);
        await wait(this, 200);
        await foe.flip(true);
        await wait(this, 250);

        const result = compareCards(mine.card, foeCard);
        if (result === 0) {
            this.status.setText('Empate!');
            await Promise.all([mine, foe].map(c => tween(this, { targets: c, angle: 6, duration: 80, yoyo: true, repeat: 2 })));
        } else {
            const playerWon = result > 0;
            const winner = playerWon ? mine : foe;
            const loser = playerWon ? foe : mine;
            const info = ELEMENTS[winner.card.element];

            this.status.setText(playerWon ? 'Você venceu a rodada!' : 'O oponente venceu a rodada');
            this.burst(winner.x, winner.y, info);
            this.flash(info.tint);
            (playerWon ? this.playerFighter : this.foeFighter).hop();
            if (winner.card.element === 'fire' && !REDUCED_MOTION) this.cameras.main.shake(160, 0.004);
            void tween(this, { targets: loser, alpha: 0.35, duration: 250 });
            await tween(this, { targets: winner, scale: LAYOUT.arenaScale * 1.15, duration: 160, yoyo: true });
            await wait(this, 450);

            const list = playerWon ? this.mine : this.theirs;
            list.push(winner.card);
            const n = list.length - 1;
            const x = playerWon ? LAYOUT.miniStartX + n * LAYOUT.miniGap : W - LAYOUT.miniStartX - n * LAYOUT.miniGap;
            createMiniCard(this, x, LAYOUT.miniY, winner.card, LAYOUT.miniScale);
        }

        await Promise.all([mine, foe].map(c => tween(this, { targets: c, alpha: 0, y: '-=30', duration: 260 })));
        mine.destroy();
        foe.destroy();
        this.foeHand[j] = createCard();
        this.spawnFoeBack(j);
        this.dealCard(i);

        if (hasWon(this.mine)) return this.finish(true);
        if (hasWon(this.theirs)) return this.finish(false);
        this.status.setText('Escolha uma carta');
        this.busy = false;
    }

    private finish(playerWon: boolean) {
        this.over = true;
        this.add.rectangle(W / 2, H / 2, W, H, 0x2a1608, 0.7).setDepth(100).setInteractive();
        const style = { fontFamily: FONT, fontStyle: '700', color: '#ffffff' };
        this.add.text(W / 2, H * 0.38, playerWon ? 'Você venceu!' : 'O oponente venceu', { ...style, fontSize: '110px' }).setOrigin(0.5).setDepth(101);
        const button = this.add.text(W / 2, H * 0.58, 'Jogar de novo', { ...style, fontSize: '56px', backgroundColor: '#2f80ed', padding: { x: 50, y: 22 } })
            .setOrigin(0.5).setDepth(101).setInteractive({ useHandCursor: true });
        button.on('pointerdown', () => this.scene.restart());
        if (playerWon) this.burst(W / 2, H * 0.38, ELEMENTS.plant);
    }
}