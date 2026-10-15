import { describe, expect, test } from 'bun:test';
import { createCard } from '../src/core/deck.ts';
import { compareCards, hasWon } from '../src/core/rules.ts';
import { COLORS, ELEMENTS } from '../src/core/types.ts';
import { ultraT } from '../src/data/monsters/ultra-t.ts';

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
} );