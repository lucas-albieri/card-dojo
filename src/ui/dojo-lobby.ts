import Phaser from 'phaser';
import { GAME_WIDTH as W } from '../config';
import { LAYOUT } from '../layout';

export function createDojoLobby(scene: Phaser.Scene) {
    const background = scene.add.image(LAYOUT.lobbyBackgroundX, LAYOUT.lobbyBackgroundY, 'dojo-background')
        .setDepth(-30);
    background.setDisplaySize(W, W * background.height / background.width);

    const structures = scene.add.graphics().setDepth(-10);
    drawArenaGate(structures);
    drawTitlePanel(structures);

    scene.add.image(LAYOUT.lobbyTableX, LAYOUT.lobbyTableY, 'dojo-table')
        .setDisplaySize(LAYOUT.lobbyTableWidth, LAYOUT.lobbyTableHeight)
        .setDepth(-9);
    scene.add.image(LAYOUT.lobbyCardsX, LAYOUT.lobbyCardsY, 'dojo-cards')
        .setDisplaySize(LAYOUT.lobbyCardsWidth, LAYOUT.lobbyCardsHeight)
        .setDepth(-8);
    scene.add.image(LAYOUT.lobbyAltarFrameX, LAYOUT.lobbyAltarFrameY, 'dojo-altar')
        .setDisplaySize(LAYOUT.lobbyAltarFrameWidth, LAYOUT.lobbyAltarFrameHeight)
        .setDepth(1);
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

function drawTitlePanel(graphics: Phaser.GameObjects.Graphics) {
    const x = LAYOUT.lobbyTitlePanelX;
    const y = LAYOUT.lobbyTitlePanelY;
    graphics.fillStyle(0x0d101c, 0.94).fillRoundedRect(x - 220, y - 68, 450, 136, 22);
    graphics.lineStyle(4, 0x0d101c, 0.9)
        .lineBetween(x - 230, y - 34, x - 210, y - 58)
        .lineBetween(x + 210, y + 50, x + 230, y + 22);
}
