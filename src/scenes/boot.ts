import Phaser from 'phaser';
import { preloadAudio } from '../ui/audio';
import { preloadPhosphorIcons } from '../ui/phosphor-icons';

export class Boot extends Phaser.Scene {
    constructor() {
        super('boot');
    }

    preload() {
        preloadAudio(this);
        preloadPhosphorIcons(this);
    }

    create() {
        this.scene.start('title');
    }
}
