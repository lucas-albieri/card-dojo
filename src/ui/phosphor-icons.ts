import Phaser from 'phaser';
import arrowsOut from '@phosphor-icons/core/assets/regular/arrows-out.svg?raw';
import arrowRight from '@phosphor-icons/core/assets/regular/arrow-right.svg?raw';
import arrowLeft from '@phosphor-icons/core/assets/regular/arrow-left.svg?raw';
import bookOpen from '@phosphor-icons/core/assets/regular/book-open.svg?raw';
import boxingGlove from '@phosphor-icons/core/assets/regular/boxing-glove.svg?raw';
import cardsThree from '@phosphor-icons/core/assets/regular/cards-three.svg?raw';
import checkCircle from '@phosphor-icons/core/assets/regular/check-circle.svg?raw';
import doorOpen from '@phosphor-icons/core/assets/regular/door-open.svg?raw';
import drop from '@phosphor-icons/core/assets/regular/drop.svg?raw';
import fire from '@phosphor-icons/core/assets/regular/fire.svg?raw';
import gift from '@phosphor-icons/core/assets/regular/gift.svg?raw';
import gear from '@phosphor-icons/core/assets/regular/gear.svg?raw';
import handPointing from '@phosphor-icons/core/assets/regular/hand-pointing.svg?raw';
import house from '@phosphor-icons/core/assets/regular/house.svg?raw';
import leaf from '@phosphor-icons/core/assets/regular/leaf.svg?raw';
import lockKey from '@phosphor-icons/core/assets/regular/lock-key.svg?raw';
import musicNotes from '@phosphor-icons/core/assets/regular/music-notes.svg?raw';
import pause from '@phosphor-icons/core/assets/regular/pause.svg?raw';
import personSimple from '@phosphor-icons/core/assets/regular/person-simple.svg?raw';
import play from '@phosphor-icons/core/assets/regular/play.svg?raw';
import question from '@phosphor-icons/core/assets/regular/question.svg?raw';
import shield from '@phosphor-icons/core/assets/regular/shield.svg?raw';
import speakerHigh from '@phosphor-icons/core/assets/regular/speaker-high.svg?raw';
import speakerSlash from '@phosphor-icons/core/assets/regular/speaker-slash.svg?raw';
import sparkle from '@phosphor-icons/core/assets/regular/sparkle.svg?raw';
import sword from '@phosphor-icons/core/assets/regular/sword.svg?raw';
import trophy from '@phosphor-icons/core/assets/regular/trophy.svg?raw';
import stairs from '@phosphor-icons/core/assets/regular/stairs.svg?raw';
import usersThree from '@phosphor-icons/core/assets/regular/users-three.svg?raw';
import x from '@phosphor-icons/core/assets/regular/x.svg?raw';
import { type ElementType } from '../core/types';

const ICONS = {
    'arrows-out': arrowsOut,
    'arrow-right': arrowRight,
    'arrow-left': arrowLeft,
    'book-open': bookOpen,
    'boxing-glove': boxingGlove,
    'cards-three': cardsThree,
    'check-circle': checkCircle,
    'door-open': doorOpen,
    drop,
    fire,
    gift,
    gear,
    'hand-pointing': handPointing,
    house,
    leaf,
    'lock-key': lockKey,
    'music-notes': musicNotes,
    pause,
    'person-simple': personSimple,
    play,
    question,
    shield,
    'speaker-high': speakerHigh,
    'speaker-slash': speakerSlash,
    sparkle,
    sword,
    stairs,
    trophy,
    'users-three': usersThree,
    x,
} as const;

export type PhosphorIcon = keyof typeof ICONS;

const textureKey = (icon: PhosphorIcon) => `phosphor-${icon}`;
const svgDataUri = (svg: string) => `data:image/svg+xml;base64,${btoa(svg.replace('currentColor', '#ffffff'))}`;

export function preloadPhosphorIcons(scene: Phaser.Scene) {
    for (const [icon, svg] of Object.entries(ICONS) as [PhosphorIcon, string][]) {
        scene.load.svg(textureKey(icon), svgDataUri(svg), { width: 128, height: 128 });
    }
}

export function addPhosphorIcon(
    scene: Phaser.Scene,
    icon: PhosphorIcon,
    x: number,
    y: number,
    size: number,
    tint: number,
    depth = 10,
) {
    return scene.add.image(x, y, textureKey(icon)).setDisplaySize(size, size).setTint(tint).setDepth(depth);
}

export function elementPhosphorIcon(element: ElementType): PhosphorIcon {
    const icons: Record<ElementType, PhosphorIcon> = {
        fire: 'fire',
        water: 'drop',
        plant: 'leaf',
    };
    return icons[element];
}
