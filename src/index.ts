import { Readability } from "@mozilla/readability";

import { convertRawGrade, rate, grade } from "./fleschKincaid";
import { getDocumentFromUrl, promptUserForUrl } from "./helper";

/**
 * Command line programme that runs on npm start
 */
(async function run() {
  const url = await promptUserForUrl();
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
