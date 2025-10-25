export function formatStudyTime(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return `${totalSeconds} сек`;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} год ${minutes} хв`;
  }

  return `${minutes} хв`;
}

export function formatDetailedTime(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts: string[] = [];

  if (days > 0) parts.push(`${days} д`);
  if (hours > 0) parts.push(`${hours} год`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes} хв`);

  return parts.join(" ");
}

export function formatShortTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours >= 100) {
    return `${hours} год`;
  }

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  }

  return `${minutes} хв`;
}

export function formatTimeHMS(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
