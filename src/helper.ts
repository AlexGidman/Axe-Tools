/**
 * Useful helper functions for parsing data and user input
 */

import { JSDOM } from "jsdom";
import readline from "readline";
import puppeteer from "puppeteer";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const prompt = (query: string): Promise<string> =>
  new Promise((resolve) => rl.question(query, resolve));

export const promptUserForUrl = async () => {
  try {
    const url = await prompt("URL: ");
    rl.close();
    return url as string;
  } catch (e) {
    console.error("Unable to prompt", e);
    process.exit(0);
  }
};

export const getDocumentFromUrl = async (
  pageUrl: string
): Promise<Document> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(pageUrl);
  page.accessibility.snapshot;

  const pageHTML = await page.evaluate(
    "new XMLSerializer().serializeToString(document.doctype) + document.documentElement.outerHTML"
  );
  await browser.close();
  return new JSDOM(pageHTML as string).window.document;
};
