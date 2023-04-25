export const emojis = ['🙂', '🧠', '😎', '👌', '💯', '🔥', '✌️', '✅', '📊', '🚀'];

export function getRandomEmoji(): string {
  return emojis[Math.floor(Math.random() * emojis.length)];
}
