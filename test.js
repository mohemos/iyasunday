const express = require("express");
const app = express();
const http = require("http");
const { encodeJwt, decodeJwt, randomString, getContent } = require("./index");

encodeJwt({
  data: { username: "Moses", password: "peter" },
  secreteKey: "moses",
  duration: "20m",
})
  .then(async (token) => {
    console.log("=========result : " + token + "==============");
    const data = await decodeJwt(token, "moses");
    console.log(data);
  })
  .catch((err) => console.log(err));

getContent({ url: "https://jsonplaceholder.typicode.com/todos/1" })
  .then((result) => console.log(result))
  .catch((err) => console.log(`=======Http error`));

app.listen(9000, () =>
  console.log("Iya sunday now running " + randomString(10))
);
