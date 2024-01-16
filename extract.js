const path = require("path");
const { createWorker } = require("tesseract.js");

const [, , imagePath] = process.argv;
const image = path.resolve(
  __dirname,
  imagePath || "20231113135539935138000000-6.jpg"
);

console.log(`Recognizing ${image}`);

(async () => {
  const worker = await createWorker("eng", 1, {
    logger: (m) => console.log(m),
  });
  const {
    data: { text },
  } = await worker.recognize(image);
  // console.log(text);
  const questionRegex = /(\d+)\.\s(.*?)(?=\d+\.|\n|$)/gs;

  // Extract question numbers and their values
  const matches = [...text.matchAll(questionRegex)];
  console.log("Matches:", matches);
  // Check if "No" is present for each question number
  const result = {};

  for (const match of matches) {
    const questionNumber = match[1];
    const questionValue = match[2].trim();
    const isNoPresent = questionValue.includes("No");
    result[questionNumber] = isNoPresent ? "No" : "";
  }

  console.log("Final output:");
  Object.entries(result).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  await worker.terminate();
})();
