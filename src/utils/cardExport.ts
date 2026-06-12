import { toPng } from "html-to-image";

function getExportBackgroundColor() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return getComputedStyle(document.documentElement)
    .getPropertyValue("--color-bg")
    .trim();
}

export async function downloadElementAsPng(
  element: HTMLElement,
  fileName: string,
) {
  const dataUrl = await toPng(element, {
    backgroundColor: getExportBackgroundColor(),
    cacheBust: true,
    pixelRatio: 1,
  });
  const link = document.createElement("a");

  link.download = fileName;
  link.href = dataUrl;
  link.click();
}
