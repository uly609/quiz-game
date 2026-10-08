const questions = [
  { category: "地理小问", question: "世界上面积最大的海洋是哪个？", answers: ["大西洋", "印度洋", "太平洋", "北冰洋"], correct: 2, explanation: "太平洋横跨亚洲、大洋洲与美洲之间，是地球上面积最大的海洋。" },
  { category: "科学小问", question: "植物进行光合作用时，主要吸收哪种气体？", answers: ["氧气", "二氧化碳", "氮气", "氢气"], correct: 1, explanation: "植物利用光能，把二氧化碳和水转化为养分，并释放氧气。" },
  { category: "历史小问", question: "活字印刷术在中国历史上由谁发明？", answers: ["蔡伦", "张衡", "毕昇", "祖冲之"], correct: 2, explanation: "北宋时期，毕昇发明了胶泥活字印刷术。" },
  { category: "自然小问", question: "成年人的心脏通常有几个腔室？", answers: ["两个", "三个", "四个", "五个"], correct: 2, explanation: "人的心脏由左心房、右心房、左心室和右心室四个腔室组成。" },
  { category: "文学小问", question: "《朝花夕拾》的作者是谁？", answers: ["老舍", "鲁迅", "朱自清", "巴金"], correct: 1, explanation: "《朝花夕拾》是鲁迅创作的一部回忆性散文集。" },
];

const screens = { start: document.querySelector("#startScreen"), quiz: document.querySelector("#quizScreen"), result: document.querySelector("#resultScreen") };
const answerList = document.querySelector("#answerList");
let currentIndex = 0;
let score = 0;
let answered = false;

function showScreen(name) {
  Object.entries(screens).forEach(([key, element]) => { element.hidden = key !== name; });
}

function renderQuestion() {
  const item = questions[currentIndex];
  answered = false;
  document.querySelector("#questionLabel").textContent = `QUESTION ${String(currentIndex + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;
  document.querySelector("#scoreValue").textContent = score;
  document.querySelector("#questionCategory").textContent = item.category;
  document.querySelector("#questionText").textContent = item.question;
  document.querySelector(".progress-track").setAttribute("aria-valuenow", currentIndex);
  document.querySelector("#progressBar").style.width = `${(currentIndex / questions.length) * 100}%`;
  document.querySelector("#answeredLabel").textContent = "选一个你认为正确的答案";
  document.querySelector("#feedback").hidden = true;
  const nextButton = document.querySelector("#nextButton");
  nextButton.disabled = true;
  nextButton.innerHTML = currentIndex === questions.length - 1 ? "查看结果 <span>→</span>" : "下一题 <span>→</span>";
  answerList.replaceChildren(...item.answers.map((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.lastElementChild.textContent = answer;
    button.addEventListener("click", () => chooseAnswer(index));
    return button;
  }));
}

function chooseAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  const item = questions[currentIndex];
  const buttons = [...answerList.children];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.correct) button.classList.add("correct");
    if (index === selectedIndex && selectedIndex !== item.correct) button.classList.add("incorrect");
  });
  const correct = selectedIndex === item.correct;
  if (correct) score += 1;
  document.querySelector("#scoreValue").textContent = score;
  document.querySelector("#answeredLabel").textContent = correct ? "答对了，继续保持！" : "别担心，记住这个小知识就好。";
  const feedback = document.querySelector("#feedback");
  feedback.innerHTML = `<strong>${correct ? "回答正确！" : "正确答案：" + item.answers[item.correct]}</strong> ${item.explanation}`;
  feedback.hidden = false;
  document.querySelector("#nextButton").disabled = false;
  document.querySelector(".progress-track").setAttribute("aria-valuenow", currentIndex + 1);
  document.querySelector("#progressBar").style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
}

function showResult() {
  const ratio = score / questions.length;
  document.querySelector("#finalScore").textContent = `${score}/${questions.length}`;
  document.querySelector("#resultIcon").textContent = ratio === 1 ? "🏆" : ratio >= .6 ? "🎉" : "🌱";
  document.querySelector("#resultTitle").textContent = ratio === 1 ? "全部答对，太棒了！" : ratio >= .6 ? "挑战完成，表现不错！" : "每次尝试都有收获！";
  document.querySelector("#resultCopy").textContent = "你完成了今天的 5 道知识小测。";
  document.querySelector("#resultMessage").textContent = ratio === 1 ? "好奇心满分，继续保持！" : ratio >= .6 ? "再玩一次，看看能不能刷新成绩。" : "多一点好奇，下次一定会更进一步。";
  showScreen("result");
}

document.querySelector("#startButton").addEventListener("click", () => { currentIndex = 0; score = 0; renderQuestion(); showScreen("quiz"); });
document.querySelector("#nextButton").addEventListener("click", () => { if (currentIndex < questions.length - 1) { currentIndex += 1; renderQuestion(); } else showResult(); });
document.querySelector("#restartButton").addEventListener("click", () => { currentIndex = 0; score = 0; renderQuestion(); showScreen("quiz"); });
