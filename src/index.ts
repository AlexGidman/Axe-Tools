import { Readability } from "@mozilla/readability";

import { convertRawGrade, rate, grade } from "./fleschKincaid";

import { JSDOM } from "jsdom";
import puppeteer from "puppeteer";

const getDocumentFromUrl = async (pageUrl: string): Promise<Document> => {
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

(async function run() {
  const url = "https://www.bbc.co.uk/bitesize/topics/z8mxrwx/articles/z9hjwxs";
  const pageHTML = await getDocumentFromUrl(url);
  let reader = new Readability(pageHTML);
  let article = reader.parse();
  const calcGrade = grade(article.textContent);
  const calcRate = rate(article.textContent);
  console.log("URL ", url);
  console.log("Grade: ", calcGrade.toFixed(1));
  console.log("Rate: ", calcRate.toFixed(1));
  console.log(convertRawGrade(calcGrade));
})();
