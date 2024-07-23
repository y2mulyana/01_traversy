const fs = require("fs");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

async function run() {
  const browser = await puppeteer.launch({
    headless: true, // or false if you want to see the browser interaction
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-infobars",
      "--window-position=0,0",
      "--ignore-certifcate-errors",
      "--ignore-certifcate-errors-spki-list",
      "--window-size=1920x1040",
    ],
  });
  const page = await browser.newPage();
  await page.goto("https://www.traversymedia.com", {
    waitUntil: "networkidle2",
  });

  // Get courses
  const courses = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#cscourses .card"), (e) => ({
      title: e.querySelector(".card-body h3").innerText,
      level: e.querySelector(".card-body .level").innerText,
      url: e.querySelector(".card-footer a").href,
    }))
  );

  console.log(courses);

  // Save data to JSON file
  fs.writeFile("courses.json", JSON.stringify(courses), (err) => {
    if (err) throw err;
    console.log("File saved");
  });

  await browser.close();
}

run();
