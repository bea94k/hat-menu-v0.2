const getUniqueRandom = <T extends { id: string }>(itemCount: number, items: T[]): T[] => {
    if (itemCount <= 0 || items.length === 0) return [];
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const uniqueItems: T[] = [];
    const seenIds = new Set<string>();
    for (const item of shuffled) {
        // keep track of seen IDs for the case when the items array includes duplicate IDs
        if (!seenIds.has(item.id)) {
            uniqueItems.push(item);
            seenIds.add(item.id);
        }
        if (uniqueItems.length === itemCount) break;
    }
    return uniqueItems;
};

export { getUniqueRandom };