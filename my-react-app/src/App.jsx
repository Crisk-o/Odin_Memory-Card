import { useState, useEffect} from 'react'
import './App.css'

const shuffleCards = (array) =>{
    const shuffledArr = [...array]
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1)); // 0 <= j <= i
        [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]]; // swaps elements at indices j and i.
      }
    return shuffledArr;
  }

function App() {
  const [medals, setMedals] = useState([]); // fetches pool of all medals to choose from
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [clickedIds, setClickedIds] = useState([]);

  const handleCardClick = (id) => {
    if(clickedIds.includes(id)){
      // USER LOST: reset score, remove all ids from clickedIds array, and reshuffle cards.
      if(score > highScore){
        setHighScore(score);
      } 
      setScore(0);
      setClickedIds([]);
      setMedals(shuffleCards(medals));   
    }
    else{
      const newScore = score+1;
      setScore(newScore);
      setClickedIds([...clickedIds, id]) // set clickedIds array to copy previous ids and append the new id.
      if(newScore === medals.length){
        alert("PERFECTION! Clicked all medals without repeats!");
        setHighScore(newScore);
        setScore(0);
        setClickedIds([]);
      }

    setMedals(shuffleCards(medals));
    }
  }
  // General syntax: useEffect(setup, dependencies?)
  // First argument is code we want to run. 
  // Second is dependency array, which here is empty array. 
  //    Tells React to only run function once, right after mounting comp.
  //    Need this empty array or else infinite loop when re-rendering.
  useEffect(() => {
    fetch('/medals.json') // Triggers network request. Returns promise. Searches inside public folder for medals.json
    .then((res) => res.json()) // Once data arrives, read raw text and parse into a usable JS obj or array. Returns another promise
    .then((data) => {setMedals(data);}) // Processing/Storing Data. 'data' variable is cleanly parsed array of medals that came from medals.json file.
    // passes data into shuffleCards method to return a shuffled array of data. Cards would load in same order if left out.
    // use setMedals(...) to update comp. state. React re-renders screen w/ shuffled medals.
    .catch((err) => console.error("Error loading medals:", err)); // safety net in case fetch fails.
  }, []);



  return (
    <>
      <div>
        <h1>Halo 3 Medals Memory Game</h1>
        <h2>Score: {score} | High Score: {highScore}</h2>
        <p>Earn points by clicking on an image but don't click on any image more than once!</p>
        <div className="cards-grid-container">
          {/* display 9 cards at a time */}
          {medals.slice(0, 9).map((medal) => (
            <div key={medal.id} className="card" onClick={() => handleCardClick(medal.id)}>
              <img style={{justifySelf: "center"}}src={medal.image} alt={medal.name}/>
              <h3>{medal.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
