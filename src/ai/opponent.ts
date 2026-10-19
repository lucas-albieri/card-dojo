import { compareCards, hasWon } from '../core/rules';
import type { AiLevel, Card } from '../core/types';

function progressScore(card: Card, wonCards: readonly Card[]): number {
    const sameElement = wonCards.filter(won => won.element === card.element);
    const sameColor = wonCards.filter(won => won.color === card.color);
    let score = 0;
    if (sameElement.length > 0 && sameColor.length === 0) score += 4;
    if (wonCards.some(won => won.element !== card.element) && sameColor.length === 0) score += 2;
    if (hasWon([...wonCards, card])) score += 100;
    return score;
}

export function chooseCard(
    hand: Card[],
    level: AiLevel = 1,
    wonCards: readonly Card[] = [],
    playerHand: readonly Card[] = [],
    playerWonCards: readonly Card[] = [],
): number {
    if (hand.length === 0) throw new Error('The opponent cannot choose from an empty hand.');
    if (level === 1) return Math.floor(Math.random() * hand.length);

    const scores = hand.map(card => {
        let score = progressScore(card, wonCards);
        if (level === 3) {
            for (const playerCard of playerHand) {
                if (compareCards(card, playerCard) > 0) {
                    const blocksProgress = progressScore(playerCard, playerWonCards);
                    score += blocksProgress > 0 ? 6 + blocksProgress : 1;
                }
            }
        }
        return score;
    });
    const bestScore = Math.max(...scores);
    const bestIndices = scores.flatMap((score, index) => score === bestScore ? [index] : []);
    return bestIndices[Math.floor(Math.random() * bestIndices.length)];
}