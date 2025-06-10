import React from 'react'
import './App.css'


export default function App2() {
  const [search, setCard] = React.useState([])
  const [fail, setFail] = React.useState([])
  const [deck, setDeck] = React.useState([])
  const [message, setMessage] = React.useState(null)
  const [showDeck, setShowDeck] = React.useState(false)
  console.log("cards in search", search)
  console.log("cards in deck:", deck);
  //=================================================================================
  //1--function used in from onSubmit, adding card to state, thus trigger rerender.
  //===============================================================================
  async function getData(formData) {
    const actionType = formData.get("action")
    const cardName = formData.get("cardInput")

    switch (true) {
      case (actionType === "search"): {
        try {
          const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${cardName}`)
          const data = await response.json()
          setMessage(null)
          setFail([])
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

        } catch (error) {
          console.log("Manually caught HTTP error:", error);
        }
        break
      }
      case (actionType === "showDeck"): {
        setShowDeck(prev => !prev)//flipping the state of show deck
        console.log(showDeck)
        break
      }
    }
  }
  //=====================================================
  //  Function that shows the deck
  //=====================================================

  //=====================================================
  //  itterating through array and displaying image/ or error details
  //=====================================================
  const cardsListEl = search.map((arrRef) => {
    return arrRef.object === "card" ?
      <div className="cardContainer" key={arrRef.id}>
        <li>
          <img src={arrRef.image_uris.normal} />
        </li>
        <button onClick={() => handleCard(arrRef)}>Add Card</button>
        <button onClick={() => removeCard(arrRef)}>Remove</button>

      </div> :
      <li key={arrRef.status}>{arrRef.details}</li>
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
    //checking for duplicates in deck state
    switch (isCardInDeck) {
      case (false): {
        setDeck(function (prev) {
          return [...prev, cardToAdd]
        })
        setMessage(`${cardToAdd.name} was added to the deck`)
        break;
      }
      case (true): {
        setMessage(`Did not add the card <${cardToAdd.name}> already exists in the deck`)
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
  function removeCard(cardInQiestion) {

  }

  const deckToShow = deck.map((arrRef) => {
    return (<li key={arrRef.id}><img src={arrRef.image_uris.normal} /></li>)
  })

  return (
    <div className="container">
      <div className="formContainer">
        <form action={getData} className="add-card-form">
          <button className="add-card-button"
            name="action"
            value="showDeck">{showDeck === false ? "Show deck" : "Hide deck"}
          </button>
          <input
            type="text"
            placeholder="Counterspell"
            //value="Counterspell"
            name="cardInput"
          />
          <button className="add-card-button"
            name="action"
            value="search">Search
          </button>

        </form>
      </div>

      <div className="card-list-style">
        <h3>{message}</h3>
        <ul>{cardsListEl}</ul>
        {showDeck === true ? <ul>{deckToShow}</ul> : null}
        <ul>{errorList}</ul>

      </div>
    </div>
  )
}

