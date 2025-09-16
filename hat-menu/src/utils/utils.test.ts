import { describe, it, expect } from 'vitest';
import { getUniqueRandom } from './utils';

type TestItem = { id: string; value: string };

const items: TestItem[] = [
    { id: 'a', value: 'A' },
    { id: 'b', value: 'B' },
    { id: 'c', value: 'C' },
    { id: 'd', value: 'D' },
    { id: 'e', value: 'E' },
];

const itemsWithDuplicates: TestItem[] = [
    { id: 'a', value: 'A1' },
    { id: 'a', value: 'A2' },
    { id: 'b', value: 'B' },
    { id: 'c', value: 'C' },
    { id: 'c', value: 'C2' },
];

describe('getUniqueRandom', () => {
    it('returns correct number of items', () => {
        const result = getUniqueRandom(3, items);
        expect(result).toHaveLength(3);
    });

    it('returns items that are unique by id', () => {
        const result = getUniqueRandom(5, items);
        const ids = result.map(i => i.id);
        expect(new Set(ids).size).toBe(result.length);
    });

    it('handles duplicate IDs in input', () => {
        const result = getUniqueRandom(5, itemsWithDuplicates);
        const ids = result.map(i => i.id);
        expect(new Set(ids).size).toBe(result.length);
        expect(ids.filter(id => id === 'a').length).toBe(1);
        expect(ids.filter(id => id === 'c').length).toBe(1);
    });

    it('returns empty array for zero or negative count', () => {
        expect(getUniqueRandom(0, items)).toEqual([]);
        expect(getUniqueRandom(-1, items)).toEqual([]);
    });

    it('returns empty array for empty input', () => {
        expect(getUniqueRandom(3, [])).toEqual([]);
    });

    it('does not exceed available unique items', () => {
        const result = getUniqueRandom(10, items);
        expect(result.length).toBe(items.length);
    });

    it('returns different order on multiple calls (randomness)', () => {
        const result1 = getUniqueRandom(5, items);
        const result2 = getUniqueRandom(5, items);
        // Not guaranteed, but likely
        expect(result1.map(i => i.id).join()).not.toBe(result2.map(i => i.id).join());
    });
});