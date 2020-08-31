let interval;
const state = {
  elapsed: 0,
  duration: data.durationMinutes * 60 + 1,
  current: 0,
  choices: Array(10),
};

const questionEl = document.getElementById("question-text");
const option1El = document.getElementById("option-1");
const option2El = document.getElementById("option-2");
const option3El = document.getElementById("option-3");
const option4El = document.getElementById("option-4");

const fullScreenStory = document.getElementById("fsstory");
const quizEl = document.getElementById("quiz");

const timeEl = document.getElementById("time");
const currentEl = document.getElementById("current-question");
const next = () => {
  if (state.current >= data.questions.length) return;

  if (state.current === 0) {
    quizEl.style.display = "block";
    fullScreenStory.style.display = "none";
  }
  state.current++;

  currentEl.innerText = state.current;
  nextQuestion = data.questions[state.current - 1];
  questionEl.innerText = nextQuestion.question;
  [option1El, option2El, option3El, option4El].forEach((el, idx) => {
    el.innerText = nextQuestion.options[idx];
    if (state.choices[state.current - 1] === idx) {
      el.classList.add("selected");
    } else {
      el.classList.remove("selected");
    }
  });
};

const prev = () => {
  if (state.current <= 0) return;

  state.current--;
  if (state.current === 0) {
    quizEl.style.display = "none";
    fullScreenStory.style.display = "block";
    currentEl.innerText = "story";
  } else {
    currentEl.innerText = state.current;
    nextQuestion = data.questions[state.current - 1];
    questionEl.innerText = nextQuestion.question;
    [option1El, option2El, option3El, option4El].forEach((el, idx) => {
      el.innerText = nextQuestion.options[idx];
      if (state.choices[state.current - 1] === idx) {
        el.classList.add("selected");
      } else {
        el.classList.remove("selected");
      }
    });
  }
};

const jump = (to) => {
  console.log("jumping to: ", to);
  if (to === "story") {
    quizEl.style.display = "none";
    fullScreenStory.style.display = "block";
    currentEl.innerText = "story";
    state.current = 0;
    return;
  }
  if (state.current === 0) {
    quizEl.style.display = "block";
    fullScreenStory.style.display = "none";
  }
  const toQuestion = data.questions[to];
  questionEl.innerText = toQuestion.question;
  [option1El, option2El, option3El, option4El].forEach((el, idx) => {
    el.innerText = toQuestion.options[idx];
    if (state.choices[to] === idx) {
      el.classList.add("selected");
    } else {
      el.classList.remove("selected");
    }
  });
  state.current = to + 1;
  currentEl.innerText = state.current;
};

const choose = (choice) => {
  const choicesEl = [option1El, option2El, option3El, option4El];
  const selectedEl = choicesEl[choice];
  if (state.choices[state.current - 1] !== undefined) {
    choicesEl[state.choices[state.current - 1]].classList.remove("selected");
  }
  state.choices[state.current - 1] = choice;
  selectedEl.classList.add("selected");
  let el = document.querySelectorAll("#quick-nav span")[state.current];
  el.classList.add("selected");
};

const submit = () => {
  if (window.confirm("Are you sure you want to submit?")) {
    clearInterval(interval);
    grade();
  }
};

const timeout = () => {
  alert("Time out, submitting automatically...");
  grade();
};

const grade = async () => {
  let result = await fetch("/grade", {
    method: "POST",
    body: JSON.stringify({ choices: state.choices }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  result = await result.text();
  document.getElementById("main").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("resultMessage").innerText = result;
};

window.onload = function() {
  quizEl.style.display = "none";
  fullScreenStory.innerText = data.story;
  interval = setInterval(() => {
    state.elapsed++;
    if (state.elapsed > state.duration) {
      console.log("time up");
      clearInterval(interval);
      timeout();
    } else {
      let secondsLeft = state.duration - state.elapsed;
      timeEl.innerText = `${Math.floor(secondsLeft / 60)}:${secondsLeft % 60}`;
    }
  }, 1000);
};
