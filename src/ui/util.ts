import Phaser from 'phaser';

export const tween = (scene: Phaser.Scene, config: Phaser.Types.Tweens.TweenBuilderConfig) =>
    new Promise<void>(resolve => scene.tweens.add({ ...config, onComplete: () => resolve() }));

export const wait = (scene: Phaser.Scene, ms: number) =>
    new Promise<void>(resolve => scene.time.delayedCall(ms, () => resolve()));