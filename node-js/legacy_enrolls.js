import dotenv from "dotenv";
dotenv.config();
// read a csv file located in the same directory as this script
import fetch from "node-fetch";
import fs from "fs";
const csv = fs.readFileSync("/Users/ggarciabas/Documents/LRMC/PPV/Legacy/rancho_import/north.csv", "utf8");

const lines = csv.split("\n");
const headers = lines[0].split(",");

const tokens = JSON.parse(process.env.TOKENS);

const data = {};
const output = [];
let count = 0;
for (let i = 1; i < 2; i++) {
  const currentLine = lines[i].split(",");

  for (let j = 0; j < headers.length; j++) {
    const header = headers[j];
    const keys = header.split(".");
    let nestedObj = data;

    for (let k = 0; k < keys.length; k++) {
      let key = keys[k];
      if (key === "authorization\r") {
        key = "authorization";
      }
      if (!nestedObj[key]) {
        nestedObj[key] = {};
      }
      if (k === keys.length - 1) {
        if (key === "enroll_status") {
          nestedObj[key] =
            currentLine[j] === "#N/A" ? "legacy_waiting" : currentLine[j];
          continue;
        }
        if (key === "class") {
          nestedObj[key] = currentLine[j] === "#N/A" ? "none" : currentLine[j];
          continue;
        }
        if (key === "enroll_date") {
          nestedObj[key] = new Date(currentLine[j])
            .toLocaleString("pt-BR")
            .slice(0, 10);
          continue;
        }
        if (key === "created_at") {
          nestedObj[key] = new Date(currentLine[j])
            .toLocaleString("pt-BR")
            .slice(0, 10);
          continue;
        }
        if (
          key === "responsability" ||
          key === "lgpd" ||
          key === "authorization"
        ) {
          nestedObj[key] = currentLine[j] === "TRUE" ? true : false;
          continue;
        }
        nestedObj[key] = currentLine[j];
      }
      nestedObj = nestedObj[key];
    }
  }
  console.log(
    `Count ${count} - ${data.user.name} - ${data.enroll.enroll_date}`
  );
  console.log(JSON.stringify(data));
  // fetch a post data to ${process.env.DEV_AWS_API_GATEWAY_URL}/enroll, passing data as body, and access_token and id_token as headers
  const enroll = await fetch(`${process.env.DEV_AWS_API_GATEWAY_URL}/enroll`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      access_token: tokens.access_token,
      id_token: tokens.id_token,
    },
  });
  if (enroll.status === 201) {
    console.log("Legacy enroll created");
  } else {
    console.log(enroll);
    output.push(enroll.message);
  }
  count++;
}
