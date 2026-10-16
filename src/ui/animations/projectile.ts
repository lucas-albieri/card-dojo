import Phaser from 'phaser';
import { LAYOUT } from '../../layout';
import type { ElementType } from '../../core/types';
import { ELEMENTS } from '../../core/types';
import { Fighter } from '../fighter';

export function flyProjectile(
    scene: Phaser.Scene,
    attacker: Fighter,
    target: Fighter,
    element: ElementType,
): Promise<void> {
    const direction = target.x > attacker.x ? 1 : -1;
    const projectile = scene.add.container(
        attacker.x + direction * LAYOUT.finisherProjectileStartOffsetX,
        attacker.y - LAYOUT.finisherProjectileYOffset,
    ).setDepth(30);
    const graphic = scene.add.graphics();
    const size = LAYOUT.finisherProjectileSize;
    graphic.lineStyle(size * 0.45, ELEMENTS[element].tint, 0.65)
        .lineBetween(-size * 2.2, 0, -size * 0.75, 0);
    graphic.fillStyle(ELEMENTS[element].tint, 1);

    if (element === 'fire') {
        graphic.fillTriangle(-size, size, 0, -size, size, size);
        graphic.fillCircle(0, size * 0.35, size * 0.65);
    } else if (element === 'water') {
        graphic.fillCircle(0, 0, size);
        graphic.fillStyle(0xffffff, 0.8).fillCircle(-size * 0.25, -size * 0.3, size * 0.28);
    } else {
        graphic.fillEllipse(0, 0, size * 2, size);
        graphic.lineStyle(3, 0xe5ffd1, 0.9).lineBetween(-size * 0.65, 0, size * 0.65, 0);
        graphic.setRotation(-0.55);
    }
    if (direction < 0) projectile.setRotation(Math.PI);
    projectile.add(graphic);

    return new Promise(resolve => {
        scene.tweens.add({
            targets: projectile,
            x: target.x - direction * LAYOUT.finisherProjectileTargetOffsetX,
            y: target.y - LAYOUT.finisherProjectileYOffset,
            rotation: Math.PI * 2 * direction,
            scale: 1.15,
            duration: LAYOUT.finisherProjectileDuration,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                projectile.destroy();
                resolve();
            },
        });
    });
}
