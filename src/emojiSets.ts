type EmojiSet = {
    name: string;
    emojis: string[];
  };
  
  const emojiSets: EmojiSet[] = [
    {
      name: 'default',
      emojis: ['😊', '👍', '🌟', '💪', '🚀', '🔥'],
    },
    {
      name: 'animals',
      emojis: ['🐶', '🐱', '🦁', '🐸', '🦄', '🐝'],
    },
    {
      name: 'food',
      emojis: ['🍕', '🍔', '🍩', '🍪', '🍇', '🍓'],
    },
  ];
  
  export function getEmojiSet(name: string): string[] {
    const emojiSet = emojiSets.find((set) => set.name === name);
    return emojiSet ? emojiSet.emojis : emojiSets[0].emojis;
  }
  