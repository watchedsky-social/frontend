import { Alert, RecentAlert } from "./models";

export const truncateDescription = (alert: RecentAlert): string => {
  const oneline = alert.description.replace(/\s/g, " ");
  const words = oneline.split(" ", 16);
  if (words.length == 16) {
    words[15] = "...";
  }

  return words.join(" ");
};

export const shortHeadline = (alert: Alert | RecentAlert): string => {
  return alert.headline.substring(0, alert.headline.indexOf("issued"));
};

export const relativeTime = (alert: RecentAlert): string => {
  const now = Date.now();
  const ago = now - alert.sent;

  if (ago < 60_000) {
    return "less than a minute ago";
  }

  if (ago >= 60_000 && ago < 3_600_000) {
    const minutes = Math.floor(ago / 60_000);
    return `${minutes} minutes ago`;
  }

  const inHours = ago / 3_600_000;
  const hours = Math.floor(inHours);
  const partialHours = inHours - hours;

  return `about ${partialHours < 0.75 ? hours : hours + 1} hours ago`;
};
