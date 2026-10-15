import Phaser from 'phaser';
import { REDUCED_MOTION } from '../config';

export interface FighterStyle {
    skin: number;      // pele
    shell: number;     // casco
    plastron: number;  // barriga
    accent: number;    // bandana e cinto
    facing: 1 | -1;    // 1 = olha para a direita, -1 = para a esquerda
}

// Lutador provisório (tartaruga ninja) feito de formas. Origem = centro dos pés, no chão.
// Para usar o sprite de verdade: apague buildPlaceholder() e faça
//   this.rig.add(scene.add.sprite(0, 0, 'fighter').setOrigin(0.5, 1))
export class Fighter extends Phaser.GameObjects.Container {
    private rig: Phaser.GameObjects.Container;

    constructor (scene: Phaser.Scene, x: number, y: number, style: FighterStyle, scale = 1) {
        super(scene, x, y);
        this.rig = scene.add.container(0, 0);
        this.buildPlaceholder(style);
        this.add(this.rig);
        this.setScale(scale);
        scene.add.existing(this);

        // respiração leve (idle)
        if (!REDUCED_MOTION) {
            scene.tweens.add({ targets: this.rig, scaleY: { from: 1, to: 1.025 }, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        }
    }

    // pulinho de comemoração
    hop() {
        if (REDUCED_MOTION) return;
        this.scene.tweens.add({ targets: this, y: this.y - 50, duration: 150, yoyo: true, ease: 'Quad.easeOut' });
    }

    private buildPlaceholder(s: FighterStyle) {
        const monster = this.scene.add.sprite(0, 0, 'monster-ultra-t').setOrigin(0.5, 1);
        monster.setFlipX(s.facing === -1);
        monster.setScale(0.9);
        this.rig.add(monster);
    }
}