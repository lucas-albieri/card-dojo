import Phaser from 'phaser';
import { GAME_HEIGHT as H, GAME_WIDTH as W } from '../config';

export function createDojoLobby(scene: Phaser.Scene) {
    const graphics = scene.add.graphics().setDepth(-20);

    graphics.fillStyle(0x182421).fillRect(0, 0, W, H);
    graphics.fillStyle(0x30413a).fillRect(0, 0, W, 620);

    for (let x = 0; x < W; x += 128) {
        graphics.fillStyle(x % 256 === 0 ? 0x394b40 : 0x34453c).fillRect(x, 76, 112, 475);
        graphics.fillStyle(0x1e2d29).fillRect(x + 112, 76, 16, 475);
    }

    graphics.fillStyle(0x5d412e).fillRect(0, 0, W, 74);
    graphics.fillStyle(0x96704a).fillRect(0, 72, W, 18);
    graphics.fillStyle(0x513a2b).fillRect(0, 540, W, 42);
    graphics.fillStyle(0x826345).fillRect(0, 577, W, 14);

    for (const x of [84, 640, 1280, 1836]) {
        graphics.fillStyle(0x795a3d).fillRect(x - 28, 76, 56, 500);
        graphics.fillStyle(0xb38a55).fillRect(x - 36, 76, 72, 20);
        graphics.fillStyle(0x49372b).fillRect(x - 40, 556, 80, 32);
    }

    graphics.fillStyle(0x9a7950).fillRect(0, 591, W, 489);
    for (let y = 610; y < H; y += 76) {
        graphics.fillStyle(y % 152 === 0 ? 0x896b49 : 0x92734e).fillRect(0, y, W, 5);
        const offset = y % 152 === 0 ? 0 : 96;
        for (let x = offset; x < W; x += 192) graphics.fillStyle(0x75583e).fillRect(x, y, 4, 76);
    }

    graphics.fillStyle(0xc6a566).fillRoundedRect(560, 630, 800, 330, 28);
    graphics.lineStyle(8, 0x513c2e, 0.9).strokeRoundedRect(560, 630, 800, 330, 28);
    graphics.fillStyle(0x637d68).fillRoundedRect(660, 720, 600, 170, 30);
    graphics.lineStyle(6, 0xd7bd7a, 0.9).strokeRoundedRect(660, 720, 600, 170, 30);

    graphics.fillStyle(0x713a26).fillRoundedRect(74, 226, 480, 550, 34);
    graphics.fillStyle(0xc26430).fillRoundedRect(108, 258, 412, 485, 26);
    graphics.fillStyle(0x262b22).fillRoundedRect(140, 292, 348, 418, 20);
    graphics.lineStyle(12, 0xe9a84d, 0.9).strokeRoundedRect(140, 292, 348, 418, 20);
    graphics.fillStyle(0x4c321f).fillRoundedRect(80, 742, 470, 62, 12);

    graphics.fillStyle(0x172522).fillRoundedRect(1390, 196, 450, 610, 44);
    graphics.lineStyle(12, 0x478b75, 0.95).strokeRoundedRect(1390, 196, 450, 610, 44);
    graphics.lineStyle(4, 0xbaff39, 0.68).strokeRoundedRect(1418, 224, 394, 554, 36);
    graphics.fillStyle(0x63482e).fillRoundedRect(1450, 744, 330, 72, 16);
    graphics.fillStyle(0xb58c52).fillRoundedRect(1428, 790, 374, 35, 14);

    graphics.fillStyle(0x5a3c28).fillRoundedRect(730, 830, 460, 170, 24);
    graphics.fillStyle(0xb18a54).fillRoundedRect(700, 810, 520, 52, 18);
    graphics.fillStyle(0xd8bc7f).fillRoundedRect(720, 820, 480, 20, 8);
    graphics.fillStyle(0x1b2a27).fillRoundedRect(814, 752, 108, 138, 14);
    graphics.fillStyle(0x1b2a27).fillRoundedRect(906, 742, 108, 148, 14);
    graphics.fillStyle(0x1b2a27).fillRoundedRect(998, 752, 108, 138, 14);
    graphics.lineStyle(5, 0xc7a85f, 0.9).strokeRoundedRect(814, 752, 108, 138, 14);
    graphics.lineStyle(5, 0xc7a85f, 0.9).strokeRoundedRect(906, 742, 108, 148, 14);
    graphics.lineStyle(5, 0xc7a85f, 0.9).strokeRoundedRect(998, 752, 108, 138, 14);

    graphics.fillStyle(0x352619).fillRoundedRect(28, 26, 270, 174, 20);
    graphics.lineStyle(5, 0xc7a85f, 0.9).strokeRoundedRect(28, 26, 270, 174, 20);
}