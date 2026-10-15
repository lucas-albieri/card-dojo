import { type Card, ELEMENTS, ELEMENT_LIST } from './types';

// 1 = a vence, -1 = b vence, 0 = empate
export function compareCards(a: Card, b: Card): number {
    if (a.element === b.element) return a.value > b.value ? 1 : a.value < b.value ? -1 : 0;
    return ELEMENTS[a.element].beats === b.element ? 1 : -1;
}

// Vitória: 3 cartas do mesmo elemento com cores diferentes,
// ou uma de cada elemento, também com cores diferentes.
export function hasWon(cards: Card[]): boolean {
    for (const e of ELEMENT_LIST) {
        if (new Set(cards.filter(c => c.element === e).map(c => c.color)).size >= 3) return true;
    }
    const by = (e: string) => cards.filter(c => c.element === e);
    for (const a of by('fire'))
        for (const b of by('water'))
            for (const c of by('plant'))
                if (new Set([a.color, b.color, c.color]).size === 3) return true;
    return false;
}