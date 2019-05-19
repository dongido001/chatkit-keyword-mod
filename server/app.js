const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Chatkit = require("@pusher/chatkit-server");
const resolve = require("path").resolve;

require("dotenv").config({ path: resolve(__dirname, "../.env") });

const app = express();
const port = process.env.APP_PORT;

// Initialises chatkit client
const chatkit = new Chatkit.default({
  instanceLocator: process.env.VUE_APP_CHATKIT_INSTANCE_LOCATOR,
  key: process.env.CHATKIT_SECRET_KEY
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/webhook", async (req, res) => {
  const messages = req.body.payload.messages;
  const messageId = messages[0]['id']

  const checkKeyword = checkData(messages[0]["parts"][0]["content"]);

  // Return response early - see https://pusher.com/docs/chatkit/webhooks#retry-strategy
  res.sendStatus(200);

  if (checkKeyword) {
    trbotDeleteMessage(messageId);
  }
});

function checkData (message) {
  // keywords that are not allowed on the chat
  const prohibited_keywords = [
    "fuck",
    "resist",
    "hate"
  ];

  let regEx = new RegExp(`\\b(${prohibited_keywords.join('|')})\\b`, 'gi')

  return regEx.test(message)
}

app.get("/get_rooms", (req, res) => {
  chatkit
    .getRooms({})
    .then(rooms => {
      res.status(200).send({
        status: "success",
        data: rooms
      });
    })
    .catch(err => {
      res.status(200).send({
        status: "error",
        message: err
      });
    });
});

function trbotDeleteMessage(messageId) {
  return chatkit.deleteMessage({
    id: messageId
  })
}

app.get("/", async (req, res) => {
  res.send({ hello: "World!" });
});

app.listen(port, () => console.log(`Node app listening on port ${port}!`));
