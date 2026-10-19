import Phaser from 'phaser';
import { GAME_WIDTH as W } from '../config';
import { LAYOUT } from '../layout';

export function createDojoLobby(scene: Phaser.Scene) {
    const background = scene.add.image(LAYOUT.lobbyBackgroundX, LAYOUT.lobbyBackgroundY, 'dojo-background')
        .setDepth(-30);
    background.setDisplaySize(W, W * background.height / background.width);

    const structures = scene.add.graphics().setDepth(-10);
    drawTitlePanel(structures);

    const portal = scene.add.image(LAYOUT.lobbyPortalX, LAYOUT.lobbyPortalY, 'dojo-portal')
        .setDisplaySize(LAYOUT.lobbyPortalWidth, LAYOUT.lobbyPortalHeight)
        .setDepth(-10);
    scene.add.image(LAYOUT.lobbyTableX, LAYOUT.lobbyTableY, 'dojo-table')
        .setDisplaySize(LAYOUT.lobbyTableWidth, LAYOUT.lobbyTableHeight)
        .setDepth(-9);
    const cards = scene.add.image(LAYOUT.lobbyCardsX, LAYOUT.lobbyCardsY, 'dojo-cards')
        .setDisplaySize(LAYOUT.lobbyCardsWidth, LAYOUT.lobbyCardsHeight)
        .setDepth(-8);
    const altarFrame = scene.add.image(LAYOUT.lobbyAltarFrameX, LAYOUT.lobbyAltarFrameY, 'dojo-altar')
        .setDisplaySize(LAYOUT.lobbyAltarFrameWidth, LAYOUT.lobbyAltarFrameHeight)
        .setDepth(1);

    return { portal, cards, altarFrame };
}

function drawTitlePanel(graphics: Phaser.GameObjects.Graphics) {
    const x = LAYOUT.lobbyTitlePanelX;
    const y = LAYOUT.lobbyTitlePanelY;
    graphics.fillStyle(0x0d101c, 0.94).fillRoundedRect(x - 220, y - 68, 450, 136, 22);
    graphics.lineStyle(4, 0x0d101c, 0.9)
        .lineBetween(x - 230, y - 34, x - 210, y - 58)
        .lineBetween(x + 210, y + 50, x + 230, y + 22);
}
