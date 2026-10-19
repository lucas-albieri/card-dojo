import { describe, expect, test } from 'bun:test';
import { createCard } from '../src/core/deck.ts';
import { compareCards, hasWon } from '../src/core/rules.ts';
import { advanceTowerRun, chooseTowerReward, getCurrentOpponent, getTowerBattleDeck, getTowerRewardOptions, startTowerRun } from '../src/core/tower.ts';
import { createTowerProgress, getUnlockedTowerIds, recordTowerClear, recordTowerFloor } from '../src/core/progress.ts';
import { COLORS, ELEMENTS } from '../src/core/types.ts';
import { ultraT, ultraTCardAssets } from '../src/data/monsters/ultra-t.ts';
import { getHeroSpecials } from '../src/data/towers/specials.ts';
import { TOWERS } from '../src/data/towers/towers.ts';
import { chooseCard } from '../src/ai/opponent.ts';

const card = ( element, value, color ) => ( { element, value, color } );

describe( 'compareCards', () => {
    test( 'follows the elemental cycle', () => {
        expect( compareCards( card( 'fire', 2, 0 ), card( 'plant', 12, 0 ) ) ).toBe( 1 );
        expect( compareCards( card( 'water', 2, 0 ), card( 'fire', 12, 0 ) ) ).toBe( 1 );
        expect( compareCards( card( 'plant', 2, 0 ), card( 'water', 12, 0 ) ) ).toBe( 1 );
    } );

    test( 'uses value for the same element and ties equal values', () => {
        expect( compareCards( card( 'fire', 9, 0 ), card( 'fire', 8, 1 ) ) ).toBe( 1 );
        expect( compareCards( card( 'fire', 8, 0 ), card( 'fire', 9, 1 ) ) ).toBe( -1 );
        expect( compareCards( card( 'fire', 8, 0 ), card( 'fire', 8, 1 ) ) ).toBe( 0 );
    } );
} );

describe( 'hasWon', () => {
    test( 'requires three different colors of one element', () => {
        expect( hasWon( [
            card( 'fire', 2, 0 ),
            card( 'fire', 3, 1 ),
            card( 'fire', 4, 2 ),
        ] ) ).toBe( true );
        expect( hasWon( [
            card( 'fire', 2, 0 ),
            card( 'fire', 3, 0 ),
            card( 'fire', 4, 1 ),
        ] ) ).toBe( false );
    } );

    test( 'requires all three elements with different colors', () => {
        expect( hasWon( [
            card( 'fire', 2, 0 ),
            card( 'water', 3, 1 ),
            card( 'plant', 4, 2 ),
        ] ) ).toBe( true );
        expect( hasWon( [
            card( 'fire', 2, 0 ),
            card( 'water', 3, 0 ),
            card( 'plant', 4, 2 ),
        ] ) ).toBe( false );
    } );

    test( 'does not win with an empty collection', () => {
        expect( hasWon( [] ) ).toBe( false );
    } );
} );

describe( 'createCard', () => {
    test( 'draws a copy from the configured deck', () => {
        const definition = ultraT.deck[ 0 ];
        const drawn = createCard( [ definition ] );

        expect( drawn ).toEqual( definition );
        expect( drawn ).not.toBe( definition );
    } );

    test( 'rejects an empty configured deck', () => {
        expect( () => createCard( [] ) ).toThrow( 'Cannot draw from an empty deck' );
    } );

    test( 'creates cards within the current game domain', () => {
        for ( let index = 0; index < 500; index += 1 ) {
            const drawn = createCard();

            expect( Object.hasOwn( ELEMENTS, drawn.element ) ).toBe( true );
            expect( drawn.value ).toBeGreaterThanOrEqual( 2 );
            expect( drawn.value ).toBeLessThanOrEqual( 12 );
            expect( drawn.color ).toBeGreaterThanOrEqual( 0 );
            expect( drawn.color ).toBeLessThan( COLORS.length );
        }
    } );
} );

describe( 'ultraT deck', () => {
    test( 'contains basic and special cards with named finishers', () => {
        expect( ultraT.deck.some( ( { kind } ) => kind === 'basic' ) ).toBe( true );
        expect( ultraT.deck.some( ( { kind, animation } ) => kind === 'special' && Boolean( animation ) ) ).toBe( true );
    } );

    test( 'uses the matching full-card art for each printed element and value', () => {
        const availableArtKeys = new Set( ultraTCardAssets.map( asset => asset.key ) );

        for ( const definition of ultraT.deck ) {
            expect( availableArtKeys.has( definition.artKey ) ).toBe( true );
            expect( definition.artKey ).toBe( `card-${definition.element}-${definition.value}` );
        }

        for ( const definition of getHeroSpecials( 'ultra-t' ) ) {
            expect( availableArtKeys.has( definition.artKey ) ).toBe( true );
            expect( definition.artKey ).toBe( `card-${definition.element}-${definition.value}` );
        }
    } );

    describe( 'tower runs', () => {
        const tower = TOWERS[ 0 ];
        const pool = getHeroSpecials( 'ultra-t' );

        test( 'starts at the first opponent and advances until the boss', () => {
            const run = startTowerRun( tower, 'ultra-t' );
            expect( getCurrentOpponent( tower, run ).id ).toBe( tower.floors[ 0 ].id );
            expect( advanceTowerRun( run, tower, true ) ).toMatchObject( {
                status: 'next-floor',
                run: { floorIndex: 1 },
            } );

            const bossRun = { ...run, floorIndex: tower.floors.length - 1 };
            expect( advanceTowerRun( bossRun, tower, true ).status ).toBe( 'tower-cleared' );
        } );

        test( 'ends a run after a loss without advancing the floor', () => {
            const run = { ...startTowerRun( tower, 'ultra-t' ), floorIndex: 2 };
            expect( advanceTowerRun( run, tower, false ) ).toMatchObject( {
                status: 'run-failed',
                run: { floorIndex: 2 },
            } );
        } );

        test( 'offers up to three unearned specials and adds a chosen one to the deck', () => {
            const run = startTowerRun( tower, 'ultra-t' );
            const options = getTowerRewardOptions( pool, run, () => 0 );
            expect( options ).toHaveLength( 3 );
            expect( new Set( options.map( option => option.id ) ).size ).toBe( 3 );

            const earned = chooseTowerReward( run, options[ 0 ], pool );
            expect( getTowerRewardOptions( pool, earned ).some( card => card.id === options[ 0 ].id ) ).toBe( false );
            expect( getTowerBattleDeck( ultraT.deck.filter( item => item.kind === 'basic' ), earned ) ).toHaveLength( 8 );
        } );

        test( 'rejects a reward that is outside the hero pool', () => {
            const run = startTowerRun( tower, 'ultra-t' );
            expect( () => chooseTowerReward( run, { ...pool[ 0 ], id: 'unknown' }, pool ) ).toThrow( 'not in this hero' );
        } );
    } );

    describe( 'tower progress', () => {
        test( 'records best floors independently and unlocks the next tower on clear', () => {
            const progress = createTowerProgress();
            const unlockedInitially = getUnlockedTowerIds( TOWERS, progress.clearedTowerIds );
            expect( unlockedInitially ).toEqual( [ TOWERS[ 0 ].id ] );

            const withRecord = recordTowerFloor( progress, TOWERS[ 0 ].id, 'ultra-t', 3 );
            const lowerRecord = recordTowerFloor( withRecord, TOWERS[ 0 ].id, 'ultra-t', 2 );
            expect( lowerRecord.bestFloorsByTowerAndHero[ `${TOWERS[ 0 ].id}:ultra-t` ] ).toBe( 3 );

            const cleared = recordTowerClear(lowerRecord, TOWERS[ 0 ].id, 'ultra-t', TOWERS[ 0 ], TOWERS);
            expect( cleared.clearedTowerIds ).toContain( TOWERS[ 0 ].id );
            expect( cleared.unlockedTowerIds ).toContain( TOWERS[ 1 ].id );
            expect( cleared.bestFloorsByTowerAndHero[ `${TOWERS[ 0 ].id}:ultra-t` ] ).toBe( TOWERS[ 0 ].floors.length );
        } );

        describe( 'opponent AI', () => {
            test( 'level two prefers a card that progresses its current win condition', () => {
                const won = [ card( 'fire', 4, 0 ) ];
                const hand = [ card( 'plant', 12, 1 ), card( 'fire', 2, 1 ) ];
                expect( chooseCard( hand, 2, won ) ).toBe( 1 );
            } );

            test( 'boss level prioritizes blocking a player card that completes a win', () => {
                const playerWon = [ card( 'fire', 4, 0 ), card( 'fire', 5, 1 ) ];
                const hand = [ card( 'fire', 2, 2 ), card( 'water', 4, 3 ) ];
                const playerHand = [ card( 'fire', 6, 2 ) ];
                expect( chooseCard( hand, 3, [], playerHand, playerWon ) ).toBe( 1 );
            } );
        } );
    } );
} );