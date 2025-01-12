import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import { Node } from "unist";
import { Image } from "mdast";

interface PluginOptions {
  width?: number;
  height?: number;
}

const remarkNextImagePlugin =
  ({ width = 640, height = 480 }: PluginOptions) =>
  (tree: Node) => {
    visit(tree, "image", (node: Image) => {
      const alt = node.alt || "";
      const url = node.url;
      const imageComponent = `<Image src="${url}" alt="${alt}" width="${width}" height="${height}" />`;
      const rawNode = {
        type: "html",
        value: imageComponent,
      };
      // Replace the node with the raw HTML node
      Object.assign(node, rawNode);
    });
  };

export default remarkNextImagePlugin;
