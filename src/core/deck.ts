import { type Card, ELEMENT_LIST } from './types';

const roll = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export function createCard(): Card {
    return {
        element: ELEMENT_LIST[roll(0, ELEMENT_LIST.length - 1)],
        value: roll(2, 12),
        color: roll(0, 3),
    };
}