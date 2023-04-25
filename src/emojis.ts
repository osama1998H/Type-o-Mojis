import { getEmojiSet } from './emojiSets';


export function getRandomEmoji(): string {
  const emojiSet = getEmojiSet('default'); // Change 'default' to the desired set, or make it configurable
  return emojiSet[Math.floor(Math.random() * emojiSet.length)];
}
