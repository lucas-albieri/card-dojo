import Phaser from 'phaser';
import { REDUCED_MOTION } from '../config';

export interface FighterStyle {
    skin: number;      // pele
    shell: number;     // casco
    plastron: number;  // barriga
    accent: number;    // bandana e cinto
    facing: 1 | -1;    // 1 = olha para a direita, -1 = para a esquerda
}

export type FighterPose = 'idle' | 'windup' | 'attack' | 'hit' | 'win';

// Lutador provisório (tartaruga ninja) feito de formas. Origem = centro dos pés, no chão.
// Para usar o sprite de verdade: apague buildPlaceholder() e faça
//   this.rig.add(scene.add.sprite(0, 0, 'fighter').setOrigin(0.5, 1))
export class Fighter extends Phaser.GameObjects.Container {
    private rig: Phaser.GameObjects.Container;
    private facing: 1 | -1;
    private breathingTween?: Phaser.Tweens.Tween;

    constructor (scene: Phaser.Scene, x: number, y: number, style: FighterStyle, scale = 1) {
        super(scene, x, y);
        this.facing = style.facing;
        this.rig = scene.add.container(0, 0);
        this.buildPlaceholder(style);
        this.add(this.rig);
        this.setScale(scale);
        scene.add.existing(this);

        // respiração leve (idle)
        if (!REDUCED_MOTION) {
            this.breathingTween = scene.tweens.add({ targets: this.rig, scaleY: { from: 1, to: 1.025 }, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        }
    }

    // pulinho de comemoração
    hop() {
        if (REDUCED_MOTION) return;
        this.scene.tweens.add({ targets: this, y: this.y - 50, duration: 150, yoyo: true, ease: 'Quad.easeOut' });
    }

    pose(name: FighterPose): Promise<void> {
        if (REDUCED_MOTION) return Promise.resolve();

        const motions = {
            idle: { duration: 100, ease: 'Sine.easeOut' },
            windup: { x: -this.facing * 24, y: 8, scaleX: 0.92, scaleY: 1.04, angle: -this.facing * 4, duration: 180, ease: 'Back.easeOut' },
            attack: { x: this.facing * 48, y: -12, scaleX: 1.12, scaleY: 0.88, angle: this.facing * 5, duration: 200, ease: 'Back.easeOut' },
            hit: { x: -this.facing * 14, y: 5, angle: -this.facing * 6, duration: 65, yoyo: true, repeat: 2, ease: 'Sine.easeInOut' },
            win: { y: -42, scaleX: 1.04, scaleY: 1.1, duration: 200, yoyo: true, ease: 'Quad.easeOut' },
        }[name];

        this.breathingTween?.pause();
        return new Promise(resolve => {
            this.scene.tweens.add({
                targets: this.rig,
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                angle: 0,
                ...motions,
                onComplete: () => {
                    this.rig.setPosition(0, 0).setScale(1).setAngle(0);
                    this.breathingTween?.resume();
                    resolve();
                },
            });
        });
    }

    private buildPlaceholder(s: FighterStyle) {
        const monster = this.scene.add.sprite(0, 0, 'monster-ultra-t').setOrigin(0.5, 1);
        monster.setFlipX(s.facing === -1);
        monster.setScale(0.9);
        this.rig.add(monster);
    }
}