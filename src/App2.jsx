import React from 'react'
import './App.css'


export default function App2() {
  const [card, setCard] = React.useState([])
  const [fail, setFail] = React.useState([])
  const [deck, setDeck] = React.useState([])

  //=================================================================================
  //1--function used in from onSubmit, adding card to state, thus trigger rerender.
  //===============================================================================
  async function getData(formData) {
    const cardName = formData.get("cardInput")

    try {
      const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${cardName}`)
      const data = await response.json()
      //check if input is a card or errormessage save in card or fail state.
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
      console.log("cards in deck:", deck);
    } catch (error) {
      console.log("Manually caught HTTP error:", error);
    }
  }

  //=====================================================
  //  itterating through array and displaying image/ or error details
  //=====================================================
  const cardsListEl = card.map((prev) => {
    return prev.object === "card" ?
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
  //=====================================================
  //  function responsible for adding a card to the deck state
  //=====================================================
  function addCardToDeck(cardToAdd) {
    const isCardInDeck = deck.some(function (cardRef) {
      return cardRef.id === cardToAdd.id
    })
    console.log("card is a duplicate", isCardInDeck)
    //checking for duplicates
    switch (isCardInDeck) {
      case (false): {
        setDeck(function (prev) {
          return [...prev, cardToAdd]
        })
        console.log("added the card")
        break;
      }
      case (true): {
        console.log("did not add the card")
        break;
      }
    }
  }

  //=============================================================================
  //  function handleCard, adding card to deck state and removing it from card state to trigger an uppdate.
  //  onClick, sending card ID as a parameter cardInQuestion to this function, 
  //  it becomes the card i want to remove/add.
  //  use addCardToDeck function to add it to deck state
  //  use setCard to remove card from state and trigger a rerender. 
  //=============================================================================
  function handleCard(cardInQuestion) {
    addCardToDeck(cardInQuestion)

    //using setCard function to uppdate state.
    //using filter to return new array that dosent contain the card i just fetched. 
    //new filtered array returns altered array -> triggers rerender
    setCard(function (prev) {
      return prev.filter(function (arrRef) {
        //based on my current array, create new [array] shallow copy. For each item, itirate through and return arrRef item only if its id is not equal to the argument (the item i want to remove). Basicly populated with items that meet my criteria. 
        return arrRef.id !== cardInQuestion.id
      })
    })
  }



  return (
    <div className="container">
      <div className="formContainer">
        <form action={getData} className="add-card-form">
          <input
            type="text"
            placeholder="Cancel"
            aria-label="serach button"
            name="cardInput"
          />
          <button className="add-card-button">Search</button>

        </form>
      </div>

      <div className="card-list-style">
        <ul >{cardsListEl}</ul>
        <ul>{errorList}</ul>

      </div>
    </div>
  )
}

