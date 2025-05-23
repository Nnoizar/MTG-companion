import React from 'react'
import './App.css'
import cards from "./cards"

export default function App() {
  const [cards, setCards] = React.useState([])
  const [fail, setFail] = React.useState([])

  //itirating through arrya and displaying images/ or error details
  const cardsListEl = cards.map((prev, index) => {
    return prev.object === "card" ?
      <div className="cardCOntainer">
        <li key={prev.id}>
          <img src={prev.image_uris.normal} />
        </li><button onClick={addCard}>Add Card</button>
      </div> :
      <li key={index}>{prev.details}</li>
  })

  const errorList = fail.map(function (arrRef) {
    return <li key={arrRef.object}>{arrRef.details}</li>
  })
  //function adding card to state and removing it from dom
  function addCard() {

  }
  //--function used in from onSubmit
  async function getData(formData) {
    const card = formData.get("cardInput")

    try {
      const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${card}`);
      const data = await response.json();

      /*       data.object === "card" ? setCards(prev => [...prev, data]) : setFail([data]) */

      const test = data.object === "card"
      switch (test) {
        case (true): {
          setCards(prev => [...prev, data])
          break
        }
        case (false): {
          setFail([data])
          break
        }
      }
      console.log("Data received:", data);
    } catch (error) {
      console.log("Manually caught HTTP error:", error);
    }
  }
  console.log(cards)
  console.log(fail)
  return (
    <div className="container">
      <form action={getData} className="add-card-form">
        <input
          type="text"
          placeholder="Cancel"
          aria-label="serach button"
          name="cardInput"
        />
        <button className="add-card-button">Search</button>
      </form>


      <ul className="card-list-style">{cardsListEl}</ul>
      <ul>{errorList}</ul>

    </div>
  )
}

