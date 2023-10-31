const username=document.getElementById('username');
const saveScoreBtn=document.getElementById('saveScoreBtn');
/*localStorage: This is a web browser feature that allows you to store key-value pairs of data locally in the user's browser.*/
const mostRecentScore=localStorage.getItem('mostRecentScore');
const finalScore=document.getElementById('finalScore');
/* The JSON.parse function is used to convert a JSON-formatted string into a JavaScript object*/
const highScores=JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES=5;
finalScore.innerText=mostRecentScore;
/*The event listener listens for the "keyup" event, which occurs when a user releases a key on the keyboard after typing into the input field.*/
username.addEventListener('keyup', () =>{
    saveScoreBtn.disabled=!username.value;
    
});

saveHighScore = (e) =>{
/*It's often used to stop the page from refreshing or navigating to a new URL when the button is clicked.*/    
    e.preventDefault();

    const score={
        score: mostRecentScore,
        name: username.value,
    };
    highScores.push(score);
    highScores.sort((a,b) => b.score - a.score);
        /*if b is higher, put b before a */
    
    highScores.splice(5); /*keep max scores of 5 */

    localStorage.setItem('highScores',JSON.stringify(highScores));
    window.location.assign('');
};