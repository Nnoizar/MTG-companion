/* ONE FUNCTION SHOULD ONLY DO INE THING */

//--function used in from onSubmit
//
function handleSubmit(event) {
     //--prevent default refresh
     event.preventDefault()
     //--getting the whole <form> element
     const formEl = event.currentTarget
     //--using React magic new FormData to get the data from the <form>
     const formData = new FormData(formEl)
     //--getting the data from the imputfield
     const card = formData.get("cardInput")
     formEl.reset()
     console.log(card)
}
<form onSubmit={handleSubmit}>
</form>

//--easier way of doing this. 
//When we use action in a form react does a lot of things for us, doing all the work for us, so we need only to access the data from the parameter
function handleSubmit2(formData) {
     //--prevent default refresh
     //--getting the whole <form> element
     //--using React magic new FormData to get the data from the <form>
     //--getting the data from the imputfield
     const card = formData.get("cardInput")
     console.log(card)
}
<form action={handleSubmit2}>
</form>


/*
event = the mail delivery 📫

event.currentTarget = the envelope ✉️ (console.log this)

event.currentTarget.value = the letter inside 📝

👤 User types: "Cancel"
     ↓
📬 React delivers an event
     ↓
📭 The event points to the input box (currentTarget)
     ↓
📄 The input box contains the typed message ("Cancel") inside `.value`
*/


//--API
/*   function handleSubmit(formData) {
    const card = formData.get("cardInput")
    //...prev is spreading the old state giving me the accsess to all the data in previous state. Rememmber imutability of React. Taking old copy, and creating new [] or {} + new data, and not manipulating existing data.  
 
    //--getting specific card from API and saving it to state.
    fetch(`https://api.scryfall.com/cards/named?fuzzy= ${card}`)
      .then((res) => res.json())
      .then(data => setCard(prev => [...prev, data]))
  } */

/* Array methods
     
🔹 1. .map()
📌 Transforms every item in the array
🧠 Think: “change each thing”
🔹 2. .filter()
📌 Keeps only the items that match a condition
🧠 Think: “remove unwanted things”
🔹 3. .find()
📌 Finds the first item that matches a condition
🧠 Think: “give me one specific match”
🔹 4. .some()
📌 Returns true if at least one item matches
🧠 Think: “is this thing in the list?”
🔹 5. .every()
📌 Returns true if all items match
🧠 Think: “are all of them like this?”
🔹 6. .includes()
📌 Checks if a primitive (like a number or string) is in the array
🧠 Think: “does this exact thing exist?”
🔹 7. .reduce() (advanced, but powerful)
📌 Combine all items into a single value
🧠 Think: “add up, count, or summarize”
*/