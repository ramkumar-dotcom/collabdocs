import { escapeHtml } from "@/lib/html";

export function fileStem(title: string): string {
  const stem = title
    .trim()
    .replace(/[<>:"/\\|?*]+/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return stem || "notepad";
}

export function downloadBlob(filename: string, content: BlobPart, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadText(title: string, text: string) {
  downloadBlob(`${fileStem(title)}.txt`, text, "text/plain;charset=utf-8");
}

export function downloadHtml(title: string, html: string) {
  const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; max-width: 800px; margin: 48px auto; color: #111; line-height: 1.6; }
    h1 { font-size: 2rem; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${html}
</body>
</html>`;
  downloadBlob(`${fileStem(title)}.html`, page, "text/html;charset=utf-8");
}

export function downloadWord(title: string, html: string) {
  const page = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:w="urn:schemas-microsoft-com:office:word">
<head><meta charset="utf-8" /><title>${escapeHtml(title)}</title></head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${html}
</body>
</html>`;
  downloadBlob(
    `${fileStem(title)}.doc`,
    page,
    "application/msword;charset=utf-8"
  );
}

export function printAsPdf(title: string, html: string) {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  document.body.appendChild(frame);

  const doc = frame.contentDocument;
  if (!doc) {
    frame.remove();
    return;
  }

  doc.open();
  doc.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { margin: 18mm; }
    body { font-family: Calibri, Arial, sans-serif; color: #111; line-height: 1.6; }
    h1 { font-size: 24pt; margin: 0 0 16px; }
    h2 { font-size: 16pt; }
    h3 { font-size: 13pt; }
    p { margin: 0 0 10px; }
    ul, ol { margin: 0 0 10px 22px; }
    a { color: #2563eb; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${html}
</body>
</html>`);
  doc.close();

  window.setTimeout(() => {
    frame.contentWindow?.focus();
    frame.contentWindow?.print();
    window.setTimeout(() => frame.remove(), 1000);
  }, 300);
}
