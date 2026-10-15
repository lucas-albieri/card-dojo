import { type Card, type CardDefinition, ELEMENT_LIST } from './types';

const roll = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export function createCard(deck?: readonly CardDefinition[]): Card {
    if (deck) {
        if (deck.length === 0) throw new Error('Cannot draw from an empty deck');
        const definition = deck[roll(0, deck.length - 1)];
        return { ...definition };
    }

    return {
        element: ELEMENT_LIST[roll(0, ELEMENT_LIST.length - 1)],
        value: roll(2, 12),
        color: roll(0, 3),
    };
}