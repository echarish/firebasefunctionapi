const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({origin: true}));

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();


// app.get("/hello-world", (req, res) => {
//   return res.status(200).send("Hello World!");
// });

// create
app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db.collection("books").doc("/" + req.body.id + "/")
          .create(req.body.book);
      return res.status(200).send({"status": "successfully created"});
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});


// read all
app.get("/api/read", (req, res) => {
  (async () => {
    try {
      const query = db.collection("books");
      const response = [];
      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs;
        for (const doc of docs) {
          const selectedItem = {
            id: doc.id,
            book: doc.data(),
          };
          response.push(selectedItem);
        }
        return response;
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});


// read
app.get("/api/read/:book_id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("books").doc(req.params.book_id);
      const item = await document.get();
      const response = item.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});


// update
app.put("/api/update/:book_id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("books").doc(req.params.book_id);
      await document.update(req.body.book);
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});


// delete
app.delete("/api/delete/:book_id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("books").doc(req.params.book_id);
      await document.delete();
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});


exports.app = functions.region("asia-northeast1").https.onRequest(app);

