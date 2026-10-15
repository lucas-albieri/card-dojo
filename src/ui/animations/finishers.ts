import Phaser from 'phaser';
import { REDUCED_MOTION } from '../../config';
import { Fighter } from '../fighter';

export async function playFinisher(scene: Phaser.Scene, animation: string, attacker: Fighter, target: Fighter) {
    if (REDUCED_MOTION) return;

    await attacker.pose('windup');
    await attacker.pose('attack');

    const effect = scene.add.graphics().setPosition(target.x, target.y - 220).setDepth(30);
    if (animation === 'snow-freeze') drawSnowflake(effect);
    else if (animation === 'vine-cage') drawVines(effect);
    else drawSlash(effect);

    await new Promise<void>(resolve => {
        scene.tweens.add({
            targets: effect,
            alpha: 0,
            scaleX: 1.25,
            scaleY: 1.25,
            duration: 420,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                effect.destroy();
                resolve();
            },
        });
    });

    await target.pose('hit');
    await attacker.pose('win');
}

function drawSlash(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(18, 0xf4f0df, 0.98).beginPath().moveTo(-120, -140).lineTo(120, 60).strokePath();
    graphics.lineStyle(7, 0xbaff39, 0.9).beginPath().moveTo(-90, -170).lineTo(150, 30).strokePath();
}

function drawSnowflake(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(12, 0xb8efff, 0.95);
    for (let index = 0; index < 3; index += 1) {
        const angle = index * Math.PI / 3;
        const x = Math.cos(angle) * 100;
        const y = Math.sin(angle) * 100;
        graphics.beginPath().moveTo(-x, -y).lineTo(x, y).strokePath();

        for (const direction of [-1, 1]) {
            const branchX = x * direction * 0.62;
            const branchY = y * direction * 0.62;
            const sideX = -Math.sin(angle) * 24 * direction;
            const sideY = Math.cos(angle) * 24 * direction;
            graphics.beginPath().moveTo(branchX, branchY).lineTo(branchX - x * direction * 0.2 + sideX, branchY - y * direction * 0.2 + sideY).strokePath();
            graphics.beginPath().moveTo(branchX, branchY).lineTo(branchX - x * direction * 0.2 - sideX, branchY - y * direction * 0.2 - sideY).strokePath();
        }
    }
}

function drawVines(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(11, 0x7bc75e, 0.98);
    for (let index = -2; index <= 2; index += 1) {
        const x = index * 42;
        graphics.beginPath()
            .moveTo(x - 24, -155)
            .lineTo(x + 18, -95)
            .lineTo(x - 18, -35)
            .lineTo(x + 24, 25)
            .lineTo(x - 12, 85)
            .strokePath();
    }
}