import React from 'react'
import './App.css'


export default function App() {
  const [search, setSearch] = React.useState([])
  const [fail, setFail] = React.useState([])
  const [deck, setDeck] = React.useState([])
  const [message, setMessage] = React.useState("Search for a card to get started")
  const [showDeck, setShowDeck] = React.useState(false)
  const [drawn, setDrawn] = React.useState([])

  //==============================================================
  //local storage deck
  //==============================================================
  const [hasLoadedDeck, setHasLoadedDeck] = React.useState(false)
  //========
  //The useEffect runs once after initial render. It stores local storage data in the storedDeck variable. Then it checks if there is any data in my local storage (it could be empty, it could be filled with data).
  React.useEffect(() => {
    const storedDeck = localStorage.getItem("savedDeck")
    if (storedDeck) {//If there is data it sets the deck state with parsed JSON data. Triggering next useEffect
      setDeck(JSON.parse(storedDeck))
    }
    setHasLoadedDeck(true)//Regardless of if there is data or not this sets the hasLoadedDeck state to true. Triggering next useEffect.
  }, [])
  //=============================================================
  //this useEffect runs only when either deck state changes or when hasLoadedDeck state changes. Enables the ability to save to local storage after mounting 
  React.useEffect(() => {
    if (hasLoadedDeck) {
      localStorage.setItem("savedDeck", JSON.stringify(deck))
    }
  }, [deck, hasLoadedDeck])
  //===============================================================
  //localstorage drawn
  //===============================================================
  React.useEffect(() => {
    const storedDraw = localStorage.getItem("savedDraw")
    if (storedDraw) {//If there is data it sets the deck state with parsed JSON data. Triggering next useEffect
      setDrawn(JSON.parse(storedDraw))
    }
    setHasLoadedDeck(true)//Regardless of if there is data or not this sets the hasLoadedDeck state to true. Triggering next useEffect.
  }, [])
  React.useEffect(() => {
    if (hasLoadedDeck) {
      localStorage.setItem("savedDraw", JSON.stringify(drawn))
    }
  }, [drawn, hasLoadedDeck])



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
          setMessage(`You have searched for <${cardName}>`)
          setFail([])
          //check if input is a card or errormessage save in card or fail state.
          const test = data.object === "card"
          switch (test) {
            case (true): {
              setSearch(prev => [...prev, data])
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
  const cardsListEl = [...search].reverse().map((arrRef) => {
    return arrRef.object === "card" ?
      <div className="card-container" key={arrRef.id}>
        <li>
          <img src={arrRef.image_uris.normal} />
        </li>
        <button className="card-action-button" onClick={() => handleCard(arrRef)}>Add card to deck</button>
        <button className="card-action-button" onClick={() => removeCardFromSearch(arrRef)}>Remove from search</button>

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
        setMessage(`<${cardToAdd.name}> was added to the deck`)
        break;
      }
      case (true): {
        setMessage(`Did not add the card <${cardToAdd.name}> already exists in the deck`)
        break;
      }
    }
  }
  //remove button logic
  function removeCardFromSearch(cardInQuestion) {
    setSearch(function (prevSearch) {
      return prevSearch.filter(function (arrRef) {//"Go through every card in the array, and only keep the one that match a condition."
        return arrRef.id !== cardInQuestion.id//Keep this card only if its id does not match the id of the card we're removing.
      })
    })
  }
  function removeCardFromDeck(cardInQuestion) {
    setDeck(function (prevDeck) {
      setMessage(`Removed <${cardInQuestion.name}> from deck`)
      return prevDeck.filter(function (arrRef) {//"Go through every card in the array, and only keep the one that match a condition."
        return arrRef.id !== cardInQuestion.id//Keep this card only if its id does not match the id of the card we're removing.
      })
    })
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
    setSearch(function (prev) {

      return prev.filter(function (arrRef) {
        //based on my current array, create new [array] shallow copy. For each item, itirate through and return arrRef item only if its id is not equal to the argument (the item i want to remove). Basicly populated with items that meet my criteria. 
        return arrRef.id !== cardInQuestion.id
      })
    })
  }

  //=====================================================
  //  function responsible for adding a card to the deck state
  //=====================================================
  const deckToShow = deck.map((arrRef) => {
    return (
      <div className="card-container" key={arrRef.id}>
        <img src={arrRef.image_uris.normal} />
        <button className="card-action-button" onClick={() => removeCardFromDeck(arrRef)}>Remove from deck</button>
      </div>)
  })
  //=====================================================
  //  function responsible for draws random card and removes it form the deck
  //=====================================================

  function drawRandomCard() {
    if (deck.length === 0) {
      setMessage("No cards left in the deck")
      return
    }

    // 1. Pick a random index from the current deck
    const randomIndex = Math.floor(Math.random() * deck.length)
    const drawnCard = deck[randomIndex]

    // 2. Remove it from the deck
    setDeck(prevDeck => {
      return prevDeck.filter((_, index) => index !== randomIndex)
    })

    // 3. Add it to the drawn pile
    setDrawn(prevDrawn => [...prevDrawn, drawnCard])

    // Optional: Show a message
    setMessage(`You drew: ${drawnCard.name}`)
  }
  const drawnCard = [...drawn].reverse().map(card => (
    <li key={card.id}>
      <img src={card.image_uris.normal} />
    </li>
  ))
  function reset() {
    setDeck(prev => [...prev, ...drawn])
    setDrawn([])
    setMessage("Search for a card to get started")
  }
  return (
    <div className="container">
      <div className="form-container">
        <form action={getData} className="add-card-form">
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
          <button className="add-card-button"
            name="action"
            value="showDeck">{showDeck === false ? "Show deck" : "Hide deck"}
          </button>
          <button className="add-card-button" onClick={drawRandomCard}>Draw a card</button>
          <button className="add-card-button" onClick={reset}>Reset the game</button>
        </form>
        <ul>
          {message}
          {errorList}
        </ul>
      </div>

      <div className="card-list-style">
        <ul>{cardsListEl}</ul>
        {showDeck === true ? <div><button onClick={() => setDeck([])} className="reset-deck" >Remove all cards from the deck</button>
          {deckToShow}</div> : null}
        <ul>{drawnCard}</ul>
      </div>
    </div>
  )
}

