import type { Card } from '../core/types';

// Por enquanto aleatório. Aqui entra uma IA melhor depois.
export function chooseCard(hand: Card[]): number {
    return Math.floor(Math.random() * hand.length);
}