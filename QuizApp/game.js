/*document.getElementById('question') is an HTML DOM (Document Object Model) manipulation method.
It selects an HTML element with the id attribute set to 'question'.*/
const question = document.getElementById('question');
/*It selects all HTML elements with the class attribute set to 'choice-text'.
The result is an HTML collection, which is converted to a real JavaScript array using Array.from().*/
const choices = Array.from(document.getElementsByClassName('choice-text'));

const questionCounterText=document.getElementById('questionCounter');
const scoreText=document.getElementById('score');



/*This variable is initialized as an empty object ({}).
It is meant to hold the data for the current question being displayed in the quiz.*/
const loader=document.getElementById('loader');
const game=document.getElementById('game');

let currentQuestion = {}
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
/*This variable is initialized as an empty array ([]).
It is meant to hold the questions that are available for the quiz.*/
let availableQuestions = [];

/*
let variableName = value;

let arrayName = [element1, element2, ...];

let objectName = {
  key1: value1,
  key2: value2,
  // ...
};*/

let questions =[];

/*fetch API */
/*A Promise in JavaScript is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.*/
/*The fetch function returns a Promise that will resolve to a Response object.*/
fetch(
    'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'
    )
.then((res) => {
/*res.json() is called. This method is available on the Response object and is used to parse the response data as JSON.*/    
    return res.json();
})
/*.then block then processes the JSON data, and loadedQuestions holds that data.*/
.then((loadedQuestions) => {
    questions= loadedQuestions.results.map( (loadedQuestion) =>{
        /*. For each loaded question, a new object formattedQuestion is created, which will be used to store the question and its answer choices.*/
        /*obj with question property coming from loadedquestion*/
        const formattedQuestion ={
            question: loadedQuestion.question,
        };
     /* initially populated with the incorrect answer choices from the loaded question.*/
        const answerChoices= [ ...loadedQuestion.incorrect_answers];
        /*gives random index between 0 and 3, to determine the position of the correct answer  */
        formattedQuestion.answer = Math.floor(Math.random() * 4) +1;
        /*.splice(index, howMany, item): This is a JavaScript array method used to add or remove elements from an array. */
        /*index: The index at which the insertion or removal should occur.
        howMany: The number of elements to remove from the array. In this case, it's set to 0, which means no elements will be removed.
        item: The element to insert into the array at the specified index.*/
        answerChoices.splice(formattedQuestion.answer - 1, 0 ,loadedQuestion.correct_answer);
        answerChoices.forEach((choice,index) => {
/* This line dynamically creates a property in the formattedQuestion object based on the index value. It uses the index to determine the choice number (e.g., choice1, choice2, etc.) and assigns the value of the current answer choice (choice) to this dynamically created property.*/            
            formattedQuestion['choice' + (index+1)]=choice;
        });
        /*This object represents a single trivia question and its multiple-choice options.*/
        return formattedQuestion;

    });
       
    startGame();
})
.catch((err) =>{
    console.error(err);
});

const CORRECT_BOUNS = 10;
const MAX_QUESTIONS = 5;

/*const functionName = (parameters) => {
  // Function body
  return result;
};*/

startGame = () => {
    questionCounter = 0;
    score = 0;
/*This line creates a copy of the questions array using the spread operator (...).*/    
    availableQuestions= [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore',score);
        //go to end page
        return window.location.assign("end.html");
    }
    questionCounter++;
    /*${} to enclose any JavaScript expression or variable. This allows you to inject the result of that expression or variable directly into the string.*/
    questionCounterText.innerText= `${questionCounter} /${MAX_QUESTIONS}`;
    
    //update the progess bar

    


/*This line generates a random number (questionIndex) within the range of available questions. This random index will be used to select a question from the availableQuestions array.*/    
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    /*This updates the question displayed on the screen.*/
    question.innerText = currentQuestion.question;

    /*array.forEach(element => {
    // Code to execute for each element in the array
});*/
    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });
    availableQuestions.splice(questionIndex, 1); /*get rid of question we used */
    acceptingAnswers = true;



};

choices.forEach(choices => {
/*When a choice element is clicked, the function defined inside the curly braces { ... } is executed.*/    
    choices.addEventListener('click', e => {
        if (!acceptingAnswers) return;
        acceptingAnswers = false;
/*This line captures the specific choice element that was clicked and stores it in the selectedChoice variable.*/        
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        if(classToApply === 'correct'){
            incrementScore(CORRECT_BOUNS);
        }

        /*The class is added to the parent element to modify the appearance of the entire choice container.*/
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);


    });
});

incrementScore = num =>{
    score +=num;
    scoreText.innerText=score;
}
