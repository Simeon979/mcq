/*
const data = {
  instructions: [
    "Read the story and answer the 10 questions",
    "marks the correct answer. [F]isidence. [W]e do not have the names of the companies.",
    "Go to the [A]",
    "Press [D] to read the 5 sentences of the poem",
  ],
  durationMinutes: 30,
};
*/
window.onload = function() {
  const instructionsEl = document.getElementById("instructions");
  /*
  data.instructions.map((instruction) => {
    let listItem = document.createElement("li");
    listItem.append(instruction);
    instructionsEl.append(listItem);
  });
  */

  const durationEl = document.querySelector("#duration p");
  durationEl.textContent += `${data.durationMinutes} minutes`;
};
