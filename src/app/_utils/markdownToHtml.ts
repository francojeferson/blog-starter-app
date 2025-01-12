import { remark } from "remark";
import html from "remark-html";
import remarkNextImagePlugin from "./nextImageSwap";

export default async function markdownToHtml(
  markdown: string
): Promise<string> {
  const result = await remark()
    .use(remarkNextImagePlugin, { width: 800, height: 600 }) // Use the plugin with custom width and height
    .use(html, { sanitize: false }) // Disable sanitization to allow custom components
    .process(markdown);

  return result.toString();
}
