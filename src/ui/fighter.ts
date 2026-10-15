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
        const f = s.facing;
        const oval = (x: number, y: number, w: number, h: number, color: number, outline = true, angle = 0) => {
            const e = this.scene.add.ellipse(x * f, y, w, h, color).setAngle(angle * f);
            if (outline) e.setStrokeStyle(5, 0x111111);
            this.rig.add(e);
            return e;
        };
        const box = (x: number, y: number, w: number, h: number, color: number, outline = true, angle = 0) => {
            const r = this.scene.add.rectangle(x * f, y, w, h, color).setAngle(angle * f);
            if (outline) r.setStrokeStyle(4, 0x111111);
            this.rig.add(r);
            return r;
        };

        oval(-52, -165, 200, 270, s.shell);                // casco (atrás do corpo)
        oval(-52, -165, 120, 190, s.shell, false);
        box(-95, -318, 56, 18, s.accent, true, -20);       // pontas da bandana
        box(-80, -296, 56, 18, s.accent, true, 12);

        oval(-42, -52, 66, 100, s.skin);                   // pernas
        oval(46, -52, 66, 100, s.skin);
        oval(-48, -10, 92, 34, s.skin);                    // pés
        oval(54, -10, 92, 34, s.skin);

        oval(-92, -190, 50, 140, s.skin, true, 14);        // braço de trás
        oval(0, -165, 176, 240, s.skin);                   // corpo
        oval(16, -165, 122, 200, s.plastron);              // barriga
        for (const y of [-205, -170, -135]) box(16, y, 100, 4, 0x111111, false);
        box(0, -108, 176, 22, s.accent);                   // cinto
        box(24, -98, 26, 38, s.accent);

        oval(92, -190, 54, 140, s.skin, true, -14);        // braço da frente
        oval(108, -128, 48, 48, s.skin);                   // mão

        oval(30, -312, 156, 124, s.skin);                  // cabeça
        // focinho
        box(30, -318, 152, 30, s.accent);                  // bandana
        oval(10, -318, 38, 24, 0xffffff);                  // olhos
        oval(62, -318, 38, 24, 0xffffff);
        oval(16, -318, 12, 16, 0x111111, false);
        oval(68, -318, 12, 16, 0x111111, false);
        box(74, -276, 36, 6, 0x111111, false);             // boca
    }
}