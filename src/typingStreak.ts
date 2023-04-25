let typingStreak = 0;

export function resetTypingStreak() {
  typingStreak = 0;
}

export function increaseTypingStreak() {
  typingStreak++;
}

export function getTypingStreak() {
  return typingStreak;
}

export function getStreakReward() {
  if (typingStreak >= 10) {
    return '🔥';
  }
  return '';
}
