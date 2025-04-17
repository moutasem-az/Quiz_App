// selected all elements
let questionsCount = document.querySelector(".quiz-info .count span");
let containerBulletsSpans = document.querySelector(".bullets .spans");
let questionArea = document.querySelector(".quiz-area .question-title");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".quiz-area .answer-area");
let submitButton = document.querySelector(".quiz-area .submit-button");
let allBullets = document.querySelector(".bullets");
let allResults = document.querySelector(".overlay .results");
let resultInPageQuiz = document.querySelector(".quiz-page .theResult");
let countdownDiv = document.querySelector(".countdown");
let overlay = document.querySelector(".overlay");
let startQies = document.querySelector(".overlay .start");
let typeLevel = document.querySelector(".overlay .info-level .type-level");
let timerLevel = document.querySelector(".overlay .info-level .time-level");
let levels = document.querySelectorAll(".overlay .levelQuiz span");
// set Option
let currentIndex = 0, rightAnswers = 0, timeApp = 3000,
    theMinutes, theSeconds, nameJson = "normal_questions.json",
    theQuestionCount = 15, theLevel = "Normal", timePling;   
// choose level 
levels.forEach((ele) => {
    ele.addEventListener("click",removeActive);
});
startQies.onclick = function(){
    // allResults.remove();
    theFirstTime = timerLevel.innerHTML;
    overlay.remove();
    getQuestions();
} 

// all function
function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObj = JSON.parse(this.responseText);
            let qCount = questionsObj.length; 
            theQuestionCount = qCount;
            // add Question count and Question spans to page 
            createBullets (qCount);
            // add Question Data
            addQuestionData(questionsObj[currentIndex], qCount);
            // time plaing
            countDown(timeApp, qCount);
            // click on submit buttom
            submitButton.onclick = () => {
                let thrRightAnswer = questionsObj[currentIndex].right_answer;
                currentIndex++;
                if(currentIndex === qCount) {
                    clearInterval(countDownInterval);
                    removeElementsFromPage();
                    submitButton.classList.add("stop"); 
                    setAllInfoAndEndQuiz(qCount, rightAnswers);
                }
                checkAnswer(thrRightAnswer, qCount);
                // remove previous Question
                questionArea.innerHTML = "";
                answerArea.innerHTML = "";
                addQuestionData(questionsObj[currentIndex], qCount);
                handelBullets();
            };
            
        }
    }
    myRequest.open("GET", nameJson, true);
    myRequest.send();
}
function createBullets (number) {
    questionsCount.innerHTML = number;
    // create spans 
    for (let i = 0; i < number; i++) {
        let theBullet = document.createElement("span");
        if (i === 0) {
            theBullet.className = "on";
        }
        containerBulletsSpans.appendChild(theBullet);
    }
}
function addQuestionData(obj, count) {
    if (currentIndex < count) {
        // creat A Question
        let questionTitle = document.createElement("h2");
        let questionText = document.createTextNode(obj['title']);
        questionTitle.appendChild(questionText);
        questionArea.appendChild(questionTitle);
        // creat The Answers
        for (let i = 1; i <= 4; i++) {
            // create Main Div
            let answerDiv = document.createElement("div");
            answerDiv.className = "answer";
            // create input
            let radioInput = document.createElement("input");
            if (i === 1) {
                radioInput.checked = true;
            }
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
            // create label
            let theLabel = document.createElement("label");
            // theLabel.for = `answer_${i}`;
            theLabel.setAttribute("for", `answer_${i}`)
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);
            theLabel.appendChild(theLabelText);
            // add Input & Lable to Main Div
            answerDiv.appendChild(radioInput);
            answerDiv.appendChild(theLabel);
            // add Main Div to page
            answerArea.appendChild(answerDiv);
        }
    }
    // if not add here   
}
function checkAnswer(rightAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoseAnswer;
    for (let i = 0; i < answers.length ; i++) {
        if (answers[i].checked) {
            theChoseAnswer = answers[i].dataset.answer;     
        }
    } 
    if (rightAnswer === theChoseAnswer) {
        rightAnswers++;
        console.log("Good Answer");
    }
}
function handelBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfBulletsSpans = Array.from(bulletsSpans);
    arrayOfBulletsSpans.forEach( (span, index) => {
        if (currentIndex === index) {
            span.className = "on"
        }
    });
}
function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        allBullets.remove(); 
        addResult(count);      
    }
}
function addResult(count) {
    let result = document.createElement("div");
    result.className = "result";
    let info = document.createElement("div");
    info.className = "info";
    let spanAnswer = document.createElement("span");
    let spanAnswerText = document.createTextNode(`You Answered ${rightAnswers} From ${count}`);
    spanAnswer.appendChild(spanAnswerText);
    let spanTime = document.createElement("span");
    let spanTimeText = document.createTextNode(`The Time: 01:45`);
    spanTime.appendChild(spanTimeText);
    info.appendChild(spanAnswer);
    info.appendChild(spanTime);
    let del = document.createElement("div");
    del.className = "del";
    let delText = document.createTextNode("X");
    del.appendChild(delText);
    result.appendChild(info);
    result.appendChild(del);
    allResults.appendChild(result);
}
function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes,seconds;
        countDownInterval = setInterval(function (){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes; 
            seconds = seconds < 10 ? `0${seconds}` : seconds; 
            countdownDiv.innerHTML = `${minutes} : ${seconds}`;
            if (--duration < 0 ) {
                clearInterval(countDownInterval);
                removeElementsFromPage();
                submitButton.classList.add("stop"); 
                setAllInfoAndEndQuiz(count, rightAnswers, theFirstTime, "00:00");           
            }
        }, 1000)
    }
}
function removeActive() {
    levels.forEach((el) => {
        el.classList.remove("active");
        this.classList.add("active");
        typeLevel.innerHTML = this.innerHTML; 
        theLevel = this.innerHTML;
        if(this.innerHTML == "Easy") {
            timeApp = 120;
            nameJson = "easy_questions.json";
            timeFromSecondsTo(timeApp);
        }
        else if(this.innerHTML == "Normal") {  
            timeApp = 150;
            nameJson = "normal_questions.json";
            timeFromSecondsTo(timeApp);
        }
        else {
            timeApp = 210;
            nameJson = "hard_questions.json";
            timeFromSecondsTo(timeApp);
        }
    });
}
function timeFromSecondsTo(secondsCount) {
    theMinutes = secondsCount < 60 ? 0 : parseInt(secondsCount / 60);
    theSeconds = secondsCount % 60;
    theMinutes = theMinutes < 10 ? `0${theMinutes}` : theMinutes; 
    theSeconds = theSeconds < 10 ? `0${theSeconds}` : theSeconds; 
    timerLevel.innerHTML = `${theMinutes} : ${theSeconds}`;
    countdownDiv.innerHTML = `${theMinutes} : ${theSeconds}`;
}
function showResultInPageQuiz (theAllAnswers, theRightAnswers, theFirstTime, theLastTime) {
    pOne = document.createElement("p");
    pOne.className = "one";
    pOneText = document.createTextNode(`You Answered ${theRightAnswers} From ${theAllAnswers}`);
    pOne.appendChild(pOneText);
    resultInPageQuiz.appendChild(pOne);
}
function setAllInfoAndEndQuiz(theAllAnswers, theRightAnswers) {
    if (theRightAnswers > theAllAnswers / 2 && theRightAnswers < theAllAnswers) {
        submitButton.innerHTML = "Good";
    } else if (theRightAnswers == theAllAnswers) {
        submitButton.innerHTML = "Very Good";
    } else {
        submitButton.innerHTML = "Bad";
    }
    showResultInPageQuiz (theAllAnswers, theRightAnswers);
}
function removeElementsFromPage() {
    questionArea.remove();
    answerArea.remove();
    allBullets.remove();
}