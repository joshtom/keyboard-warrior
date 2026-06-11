import type { GameResult } from "@/types";
import { getElementPngBlob } from "@/utils/cardExport";

type ShareCardOptions = {
  element: HTMLElement;
  fileName: string;
  result: GameResult;
};

type NavigatorWithShare = Navigator & {
  canShare?: (data: ShareData) => boolean;
  share?: (data: ShareData) => Promise<void>;
};

function getShareUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.origin;
}

export function getResultShareText(result: GameResult) {
  return `I scored ${result.score} in Keyboard Warrior (${result.mode} / ${result.difficulty}). Accuracy: ${result.accuracy}%, Avg speed: ${result.averageReactionMs}ms.`;
}

export function openXShare(result: GameResult) {
  const shareText = getResultShareText(result);
  const shareUrl = getShareUrl();
  const params = new URLSearchParams({
    text: shareUrl ? `${shareText} ${shareUrl}` : shareText,
  });

  window.open(
    `https://twitter.com/intent/tweet?${params.toString()}`,
    "_blank",
    "noopener,noreferrer",
  );
}

export function openLinkedInShare() {
  const shareUrl = getShareUrl();
  const params = new URLSearchParams({
    url: shareUrl || "https://keyboard-warrior.local",
  });

  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`,
    "_blank",
    "noopener,noreferrer",
  );
}

export async function shareScoreCard({
  element,
  fileName,
  result,
}: ShareCardOptions) {
  const navigatorWithShare = navigator as NavigatorWithShare;

  if (!navigatorWithShare.share) {
    throw new Error("Native sharing is not supported in this browser.");
  }

  const blob = await getElementPngBlob(element);

  if (!blob) {
    throw new Error("Score card could not be prepared for sharing.");
  }

  const file = new File([blob], fileName, { type: "image/png" });
  const shareText = getResultShareText(result);
  const fileShareData = {
    files: [file],
    text: shareText,
    title: "Keyboard Warrior score",
  };

  if (navigatorWithShare.canShare?.(fileShareData)) {
    await navigatorWithShare.share(fileShareData);
    return;
  }

  await navigatorWithShare.share({
    text: shareText,
    title: "Keyboard Warrior score",
    url: getShareUrl(),
  });
}
