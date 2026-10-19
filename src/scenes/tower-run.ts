import Phaser from 'phaser';
import { FONT, GAME_HEIGHT as H, GAME_WIDTH as W } from '../config';
import { advanceTowerRun, getTowerBattleDeck, startTowerRun, type TowerRun } from '../core/tower';
import { recordTowerClear, recordTowerFloor } from '../core/progress';
import { getMonster } from '../data/monsters';
import { getTower, TOWERS } from '../data/towers/towers';
import { getGameSave, updateTowerProgress } from '../storage/local-save';
import { createMenuButton } from '../ui/menu-button';
import { addPhosphorIcon } from '../ui/phosphor-icons';

type TowerRunData = {
    towerId: string;
    heroId?: string;
    run?: TowerRun;
    won?: boolean;
    finished?: 'cleared' | 'failed';
};

export class TowerRunScene extends Phaser.Scene {
    constructor() {
        super('tower-run');
    }

    create(data: TowerRunData) {
        const tower = getTower(data.towerId);
        const heroId = data.run?.heroId ?? data.heroId ?? getGameSave().progress.selectedHeroId;
        const run = data.run ?? startTowerRun(tower, heroId);

        if (data.finished) {
            this.showFinish(tower.name, data.finished === 'cleared');
            return;
        }

        if (data.won !== undefined) {
            const advance = advanceTowerRun(run, tower, data.won);
            if (advance.status === 'run-failed') {
                this.scene.start('tower-run', { towerId: tower.id, run, finished: 'failed' });
                return;
            }
            if (advance.status === 'tower-cleared') {
                updateTowerProgress(recordTowerClear(getGameSave().progress.towers, tower.id, heroId, tower, TOWERS));
                this.scene.start('tower-run', { towerId: tower.id, run: advance.run, finished: 'cleared' });
                return;
            }
            updateTowerProgress(recordTowerFloor(
                getGameSave().progress.towers,
                tower.id,
                heroId,
                run.floorIndex + 1,
            ));
            this.scene.start('reward', { towerId: tower.id, run: advance.run });
            return;
        }

        const opponent = tower.floors[run.floorIndex];
        if (!opponent) throw new Error(`Tower "${tower.id}" has no opponent at floor ${run.floorIndex}.`);
        const monster = getMonster(heroId);
        const basicDeck = monster.deck.filter(card => card.kind === 'basic');
        const playerDeck = getTowerBattleDeck(basicDeck, run);
        this.scene.start('battle', {
            playerDeck,
            opponent,
            onFinish: ({ won }: { won: boolean }) => {
                this.scene.start('tower-run', { towerId: tower.id, run, won });
            },
        });
    }

    private showFinish(towerName: string, cleared: boolean) {
        this.cameras.main.setBackgroundColor('#10170f');
        addPhosphorIcon(this, cleared ? 'trophy' : 'shield', W / 2, H * 0.28, 90, cleared ? 0xbaff39 : 0xf3e5c7, 2);
        this.add.text(W / 2, H * 0.42, cleared ? `${towerName} concluída!` : 'Corrida encerrada', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '76px',
            color: '#ffffff',
        }).setOrigin(0.5);
        this.add.text(W / 2, H * 0.53, cleared ? 'A próxima torre foi desbloqueada.' : 'Você pode tentar novamente desde o primeiro andar.', {
            fontFamily: FONT,
            fontSize: '34px',
            color: '#d4cbdc',
        }).setOrigin(0.5);
        createMenuButton(this, W / 2, H * 0.69, 440, 86, 'VER TORRES', () => {
            this.scene.start('tower-select');
        }, true, false, 'stairs');
        createMenuButton(this, W / 2, H * 0.81, 260, 64, 'INÍCIO', () => {
            this.scene.start('title');
        }, false, true, 'house');
    }
}
