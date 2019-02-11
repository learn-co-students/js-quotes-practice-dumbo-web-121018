// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener('DOMContentLoaded', event => {

  // Variables
  const quotesURL = "http://localhost:3000/quotes"
  const quoteList = document.querySelector("#quote-list")
  const quoteForm = document.querySelector("#new-quote-form")

  // Get all quotes on DOM
  fetch(quotesURL)
    .then(res => res.json())
    .then(quotes => quotes.forEach(displayQuote))

  function displayQuote(quote) {
    quoteList.innerHTML += `<li class='quote-card' data-id="${quote.id}">
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
    </li>`
  }


  // Create New Quote
  quoteForm.addEventListener('submit', createNewQuote)

  function createNewQuote(event) {
    event.preventDefault();

    let quoteField = event.target.quote.value;
    let authorField = event.target.author.value;

    // let newQuote = {
    // quote: quoteField,
    // author: authorField,
    // likes: 0
    // }
    // displayQuote(newQuote);

    fetch(quotesURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quote: quoteField,
        author: authorField,
        likes: 0
      })
    })
      .then(res => res.json())
      .then(quote => displayQuote(quote))
  }

  // Delete Quote
  quoteList.addEventListener('click', deleteQuote)

  function deleteQuote(event) {
    const clickedQuote = event.target.parentElement.parentElement
    const quoteId = clickedQuote.dataset.id

    if (event.target.className === "btn-danger") {
      clickedQuote.remove();

      fetch(`${quotesURL}/${quoteId}`, {
        method: "DELETE"
      })
    }
  }


  // Increase Likes
  quoteList.addEventListener('click', increaseLikes)

  function increaseLikes(event) {
    const clickedQuote = event.target.parentElement.parentElement
    const quoteId = clickedQuote.dataset.id

    if (event.target.className === "btn-success") {
      let quoteLikes = event.target.children[0]
      quoteLikes.innerText = parseInt(quoteLikes.innerText) + 1

      fetch(`${quotesURL}/${quoteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          likes: parseInt(quoteLikes.innerText)
        })
      })
    }
  }


})
