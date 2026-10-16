import Phaser from 'phaser';
import { GAME_WIDTH as W } from '../config';
import { LAYOUT } from '../layout';

export function createDojoLobby(scene: Phaser.Scene) {
    const background = scene.add.image(LAYOUT.lobbyBackgroundX, LAYOUT.lobbyBackgroundY, 'dojo-background')
        .setDepth(-30);
    background.setDisplaySize(W, W * background.height / background.width);

    const structures = scene.add.graphics().setDepth(-10);
    drawArenaGate(structures);
    drawDeckTable(structures);
    drawFighterAltar(structures);
    drawLogoFrame(structures);

    const foreground = scene.add.graphics().setDepth(3);
    drawFighterAltarForeground(foreground);
}

function drawArenaGate(graphics: Phaser.GameObjects.Graphics) {
    graphics.fillStyle(0x210f16, 0.96).fillRoundedRect(62, 215, 490, 585, 38);
    graphics.lineStyle(12, 0x4b211c, 1).strokeRoundedRect(62, 215, 490, 585, 38);
    graphics.fillStyle(0x8a3028, 0.96).fillRoundedRect(90, 235, 438, 525, 30);
    graphics.lineStyle(6, 0xc8733d, 0.95).strokeRoundedRect(90, 235, 438, 525, 30);
    graphics.fillStyle(0x111820, 0.98).fillRoundedRect(140, 290, 340, 422, 20);
    graphics.lineStyle(12, 0xd9a951, 0.98).strokeRoundedRect(140, 290, 340, 422, 20);
    graphics.lineStyle(3, 0x68422f, 0.95).strokeRoundedRect(155, 305, 310, 392, 14);

    graphics.fillStyle(0x32171a, 1).fillRoundedRect(72, 744, 468, 65, 14);
    graphics.lineStyle(6, 0x81512f, 1).strokeRoundedRect(72, 744, 468, 65, 14);
    graphics.fillStyle(0x57251f, 1).fillRect(78, 220, 28, 535);
    graphics.fillStyle(0x57251f, 1).fillRect(508, 220, 28, 535);
    graphics.fillStyle(0x391b1b, 1).fillRoundedRect(52, 196, 508, 38, 12);
    graphics.lineStyle(5, 0xd3974b, 0.95).strokeRoundedRect(52, 196, 508, 38, 12);
    graphics.fillStyle(0x30181a, 1).fillRoundedRect(52, 786, 508, 26, 10);
    graphics.lineStyle(4, 0xa36636, 0.95).strokeRoundedRect(52, 786, 508, 26, 10);
}

function drawDeckTable(graphics: Phaser.GameObjects.Graphics) {
    graphics.fillStyle(0x28151a, 0.94).fillRoundedRect(516, 624, 888, 362, 54);
    graphics.lineStyle(10, 0x4c281f, 1).strokeRoundedRect(516, 624, 888, 362, 54);
    graphics.fillStyle(0xd4a45f, 1).fillRoundedRect(548, 632, 824, 316, 52);
    graphics.lineStyle(8, 0x38221c, 1).strokeRoundedRect(548, 632, 824, 316, 52);
    graphics.fillStyle(0x192729, 1).fillRoundedRect(650, 696, 620, 196, 32);
    graphics.lineStyle(6, 0x98734a, 1).strokeRoundedRect(650, 696, 620, 196, 32);
    graphics.lineStyle(4, 0xe5bc72, 0.95).strokeRoundedRect(668, 712, 584, 164, 24);

    graphics.fillStyle(0x43231d, 1).fillRoundedRect(700, 818, 520, 172, 26);
    graphics.lineStyle(8, 0x85502f, 1).strokeRoundedRect(700, 818, 520, 172, 26);
    graphics.fillStyle(0xa66b3b, 1).fillRoundedRect(676, 794, 568, 72, 22);
    graphics.lineStyle(6, 0xe3b768, 1).strokeRoundedRect(676, 794, 568, 72, 22);
    graphics.fillStyle(0x1b292b, 1).fillRoundedRect(792, 738, 112, 160, 14);
    graphics.fillStyle(0x1b292b, 1).fillRoundedRect(904, 726, 112, 172, 14);
    graphics.fillStyle(0x1b292b, 1).fillRoundedRect(1016, 738, 112, 160, 14);
    graphics.lineStyle(6, 0xd6a64f, 1).strokeRoundedRect(792, 738, 112, 160, 14);
    graphics.lineStyle(6, 0xd6a64f, 1).strokeRoundedRect(904, 726, 112, 172, 14);
    graphics.lineStyle(6, 0xd6a64f, 1).strokeRoundedRect(1016, 738, 112, 160, 14);
}

function drawFighterAltar(graphics: Phaser.GameObjects.Graphics) {
    graphics.fillStyle(0x110e1d, 0.97).fillRoundedRect(1382, 190, 464, 624, 44);
    graphics.lineStyle(12, 0x5a3a79, 1).strokeRoundedRect(1382, 190, 464, 624, 44);
    graphics.lineStyle(5, 0x9a65cd, 1).strokeRoundedRect(1398, 206, 432, 592, 36);
    graphics.lineStyle(3, 0x4c315f, 1).strokeRoundedRect(1410, 218, 408, 568, 30);
    graphics.fillStyle(0x17111e, 1).fillRoundedRect(1440, 742, 348, 74, 18);
    graphics.lineStyle(5, 0x7847a0, 1).strokeRoundedRect(1440, 742, 348, 74, 18);
    graphics.fillStyle(0x4a3028, 1).fillRoundedRect(1418, 790, 394, 42, 16);
    graphics.lineStyle(4, 0xd6a34e, 1).strokeRoundedRect(1418, 790, 394, 42, 16);
}

function drawFighterAltarForeground(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(5, 0xc58be9, 0.96).strokeRoundedRect(1392, 200, 444, 604, 40);
    graphics.lineStyle(3, 0x6b4a87, 0.95).strokeRoundedRect(1406, 214, 416, 576, 32);
    graphics.lineStyle(5, 0xdda958, 0.96)
        .lineBetween(1412, 224, 1450, 224)
        .lineBetween(1778, 224, 1816, 224)
        .lineBetween(1412, 782, 1450, 782)
        .lineBetween(1778, 782, 1816, 782);
}

function drawLogoFrame(graphics: Phaser.GameObjects.Graphics) {
    graphics.fillStyle(0x10101a, 0.98).fillRoundedRect(30, 24, 270, 176, 20);
    graphics.lineStyle(6, 0x6f4b83, 0.98).strokeRoundedRect(30, 24, 270, 176, 20);
    graphics.lineStyle(3, 0xd0a35a, 0.98).strokeRoundedRect(38, 32, 254, 160, 16);
}
