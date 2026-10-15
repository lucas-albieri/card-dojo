import Phaser from 'phaser';
import { LAYOUT } from '../layout';

// Cenário básico do dojo, só com formas. Troque por imagens quando tiver as artes:
// scene.add.image(W / 2, H / 2, 'dojo-bg').setDepth(-10)
export function createDojoBackground(scene: Phaser.Scene) {
    const W = scene.scale.width;
    const H = scene.scale.height;
    const { floorTop, frontEdge, barTop, ropes } = LAYOUT;
    const g = scene.add.graphics().setDepth(-10);

    // parede de madeira
    g.fillStyle(0xe9b98f).fillRect(0, 0, W, floorTop);
    for (let x = 0; x < W; x += 64) g.fillStyle(0xd6a273).fillRect(x, 0, 4, floorTop);

    // viga do topo
    g.fillStyle(0x7a4e32).fillRect(0, 0, W, 56);
    g.fillStyle(0xa56f49).fillRect(0, 56, W, 10);

    // colunas
    for (const ratio of [0.12, 0.49, 0.85]) {
        const x = W * ratio;
        g.fillStyle(0xc99a74).fillRect(x - 70, 66, 140, floorTop - 66);
        g.fillStyle(0xb2825c).fillRect(x - 70, 66, 28, floorTop - 66);
        g.fillStyle(0x8f6342).fillRoundedRect(x - 92, 66, 184, 34, 10);
        g.fillStyle(0x8f6342).fillRoundedRect(x - 100, floorTop - 56, 200, 56, 14);
    }

    // piso do ringue
    g.fillStyle(0xf6dcc0).fillRect(0, floorTop, W, frontEdge - floorTop);
    g.fillStyle(0xe8c4a0).fillRect(0, floorTop, W, 14);
    g.lineStyle(8, 0x1a1a1a);
    for (const y of ropes) g.lineBetween(0, y, W, y);

    // frente do ringue com borda ondulada
    g.fillStyle(0xf2d9a6).fillRect(0, frontEdge, W, barTop - frontEdge);
    g.lineStyle(7, 0x1a1a1a).beginPath().moveTo(0, frontEdge);
    for (let x = 0; x <= W; x += 8) g.lineTo(x, frontEdge + Math.sin(x / 38) * 10);
    g.strokePath();
    g.fillStyle(0x6b4630);
    for (const ratio of [0.1, 0.5, 0.9]) g.fillRect(W * ratio - 14, frontEdge + 14, 28, barTop - frontEdge - 14);

    // barra de baixo (cartas)
    g.fillStyle(0x8c5e3c).fillRect(0, barTop, W, H - barTop);
    g.fillStyle(0xb9855a).fillRect(0, barTop, W, 22);
    g.fillStyle(0x6e4630).fillRect(0, barTop + 22, W, 6);
    g.fillStyle(0xd7ad82).fillRoundedRect(24, barTop + 34, W - 48, H - barTop - 42, 12);
}