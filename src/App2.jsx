import React from 'react'
import './App.css'


export default function App2() {
  const [card, setCard] = React.useState([])
  const [fail, setFail] = React.useState([])
  const [deck, setDeck] = React.useState([])

  //¯¯¯itirating through array and displaying image/ or error details
  const cardsListEl = card.map((prev) => {
    return prev.object === "card" ?
      //remmember to move the kay out to the outermost element
      <div className="cardContainer" key={prev.id}>
        <li>
          <img src={prev.image_uris.normal} />
        </li>
        <button onClick={() => handleCard(prev)}>Add Card</button>
      </div> :
      <li key={prev.status}>{prev.details}</li>
  })

  const errorList = fail.map(function (arrRef) {
    return <li key={arrRef.object}>{arrRef.details}</li>
  })
  //___

  //¯¯¯function responsible for adding a card to deck state
  function addCardToDeck(cardToAdd) {
    setDeck(function (prev) {
      return [...prev, cardToAdd]
    })
  }
  //___

  //---function adding card to state and removing it from state to trigger an uppdate.
  //onClick, sending card ID as a parameter to thsi function, it becomes the card i want to remove.
  function handleCard(cardToRemove) {
    addCardToDeck(cardToRemove)
    //using setter function to uppdate state, using filter to return new array that dosent contain the card i just fetched. 
    //new filtered array returns altered array -> triggers rerender
    setCard(function (prev) {
      return prev.filter(function (arrRef) {
        //based on my current array, create new [array] shallow copy. For each item, itirate through and return arrRef item only if its id is not equal to the argument (the item i want to remove). Basicly populated with items that meet my criteria. 
        return arrRef.id !== cardToRemove.id
      })
    })
  }

  //--function used in from onSubmit, adding card to state, and trigger rerender.
  async function getData(formData) {
    const cardName = formData.get("cardInput")

    try {
      const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${cardName}`);
      const data = await response.json();

      /*data.object === "card" ? setCards(prev => [...prev, data]) : setFail([data]) */

      const test = data.object === "card"
      switch (test) {
        case (true): {
          setCard(prev => [...prev, data])
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

  console.log("Deck:", deck);

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

