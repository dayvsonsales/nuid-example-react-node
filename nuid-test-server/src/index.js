require("dotenv/config");

const express = require("express");
const cors = require("cors");

const fs = require("fs");
const path = require("path");
const api = require("./services/api");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  const email = req.body.email;

  try {
    const { data } = await api.post("/credential", {
      "nuid.credential/verified": req.body.credential,
    });

    const nuid = data["nu/id"];

    fs.writeFileSync(
      path.join(__dirname, "db.json"),
      JSON.stringify({ email, nuid })
    );

    res.status(200).json({ email, nuid });
  } catch (e) {
    res.sendStatus(500);
  }
});

app.post("/challenge", async (_, res) => {
  const { nuid } = JSON.parse(fs.readFileSync(path.join(__dirname, "db.json")));

  if (!nuid) {
    res.sendStatus(404);
    return;
  }

  try {
    const { data: challengeBody } = await api.get(`/credential/${nuid}`);
    const { data: challengeRes } = await api.post("/challenge", challengeBody);
    const challengeJwt = challengeRes["nuid.credential.challenge/jwt"];

    res.send({ challengeJwt: challengeJwt });
  } catch (e) {
    res.sendStatus(500);
  }
});

app.post("/login", async (req, res) => {
  const proof = req.body.proof;
  const challengeJwt = req.body.challengeJwt;

  const user = JSON.parse(fs.readFileSync(path.join(__dirname, "db.json")));

  if (!user) {
    res.sendStatus(401);
    return;
  }

  try {
    const verifyRes = await api.post("/challenge/verify", {
      "nuid.credential.challenge/jwt": challengeJwt,
      "nuid.credential/proof": proof,
    });

    if (verifyRes.status === 200) {
      res.sendStatus(201);
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    res.sendStatus(401);
  }
});

app.get("/", (_, res) => res.send({ message: "It works" }));

app.listen(4000, () => {
  console.log("Server running");
});
