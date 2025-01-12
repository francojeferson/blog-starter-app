import { Post } from "@/interfaces/post";
import { SalesPageType } from "@/interfaces/salesPage";
import { CheckoutPageType } from "@/interfaces/checkoutPage";
import { UpsellPageType } from "@/interfaces/upsellPage";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import markdownToHtml from "./markdownToHtml";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export async function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedData = {
    ...data,
    intro: await markdownToHtml(data.intro || ""),
    story: await markdownToHtml(data.story || ""),
    content: await markdownToHtml(content || ""),
    slug: realSlug,
  };

  return processedData as Post;
}

function getPostBySlugOLD(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlugOLD(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.updatedAt > post2.updatedAt ? -1 : 1));
  return posts;
}

const salesDirectory = join(process.cwd(), "_sales");

export function getSalesSlugs() {
  return fs.readdirSync(salesDirectory);
}

export async function getSalesBySlug(slug: string): Promise<SalesPageType> {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(salesDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Process markdown fields
  const processedData = {
    ...data,
    info: {
      ...data.info,
      text: await markdownToHtml(data.info.text || ""),
      textBottom: await markdownToHtml(data.info.textBottom || ""),
    },
    splitcompare: {
      ...data.splitcompare,
      subheading: await markdownToHtml(data.splitcompare.subheading || ""),
    },
  };

  return {
    ...processedData,
    slug: realSlug,
    content: await markdownToHtml(content),
  } as SalesPageType;
}
const checkoutDirectory = join(process.cwd(), "_checkout");

export function getCheckoutSlugs() {
  return fs.readdirSync(checkoutDirectory);
}

export function getCheckoutBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(checkoutDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as CheckoutPageType;
}

const upsellDirectory = join(process.cwd(), "_upsell");

export function getUpsellBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(upsellDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as UpsellPageType;
}
