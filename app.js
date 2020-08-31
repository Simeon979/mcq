let express = require("express");
let mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TestSchema = new Schema({
  story: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      answer: { type: Number, required: true },
    },
  ],
  //  ongoing: [{ testId: mongoose.Types.ObjectId, started: Date }],
});

const Test = mongoose.model("Test", TestSchema);

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("successfully connected to the database");
  })
  .catch((err) => {
    console.error(`error connecting to the database: ${err}`);
  });
let app = express();
app.use(express.json());
app.use("/static", express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res, next) => {
  try {
    let [test] = await Test.find();
    const data = { durationMinutes: test.durationMinutes };
    res.render("index", { data });
  } catch (err) {
    return next(err);
  }
});

app.get("/question", async (req, res, next) => {
  try {
    const [test] = await Test.find();
    res.render("question", {
      data: {
        story: test.story,
        durationMinutes: test.durationMinutes,
        // remove the answer from the question before sending to the client
        questions: test.questions.map(({ question, options }) => ({
          question,
          options,
        })),
      },
    });
  } catch (err) {
    return next(err);
  }
});

app.post("/grade", async (req, res, next) => {
  try {
    const [test] = await Test.find();
    const { choices } = req.body;
    const answers = test.questions.map((question) => question.answer);
    let score = 0;
    console.log("answer: ", answers);
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] === choices[i]) score += 5;
    }

    let gradePercent = (score / 50) * 100;

    res.send(
      `${
        gradePercent >= 75 ? "Congratulations, You passed" : "Sorry, You failed"
      } . Your score was ${gradePercent}%`
    );
  } catch (err) {
    return next(err);
  }
});

app.get("/edit", async (req, res, next) => {
  try {
    const [test] = await Test.find();
    res.json({
      story: test.story,
      durationMinutes: test.durationMinutes,
      questions: test.questions,
    });
  } catch (err) {
    return next(err);
  }
});

app.post("/edit", async (req, res, next) => {
  try {
    const [test] = await Test.find();
    const { story, durationMinutes, questions } = req.body;
    test.story = story;
    test.durationMinutes = durationMinutes;
    test.questions = questions;
    await Test.save();
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});

app.use("*", (req, res) => res.status(404).send("Not found"));
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(`An error occurred processing your request: ${err}`);
});

app.listen(process.env.PORT, () =>
  console.log(`App started on port ${process.env.PORT}`)
);
