import { combineLatest, fromEvent, from } from 'rxjs'
import { startWith, map, flatMap } from 'rxjs/operators'

// DOM elements
const refreshButton = document.querySelector('.refresh')
const closeButton1 = document.querySelector('.close1')
const closeButton2 = document.querySelector('.close2')
const closeButton3 = document.querySelector('.close3')

// render function
const renderSuggestion = (suggestedUser, selector) => {
  const suggestionEl = document.querySelector(selector)
  if (suggestedUser === null) {
    suggestionEl.style.visibility = 'hidden'
  } else {
    suggestionEl.style.visibility = 'visible'
    const usernameEl = suggestionEl.querySelector('.username')
    usernameEl.href = suggestedUser.html_url
    usernameEl.textContent = suggestedUser.login
    const imgEl = suggestionEl.querySelector('img')
    imgEl.src = ''
    imgEl.src = suggestedUser.avatar_url
  }
}

// streams
const refreshClickStream = fromEvent(refreshButton, 'click')
const close1ClickStream = fromEvent(closeButton1, 'click').pipe(startWith('startup  click'))
const close2ClickStream = fromEvent(closeButton2, 'click').pipe(startWith('startup  click'))
const close3ClickStream = fromEvent(closeButton3, 'click').pipe(startWith('startup  click'))

const responseStream = refreshClickStream.pipe(
  startWith('startup click'),
  map(() => 'https://api.github.com/users?since=' + Math.floor(Math.random() * 500)),
  flatMap(requestUrl => from(window.fetch(requestUrl).then(response => response.json())))
)

const createSuggestionStream = closeClickStream => combineLatest(responseStream, closeClickStream, listUsers => listUsers[Math.floor(Math.random() * listUsers.length)])

createSuggestionStream(close1ClickStream).subscribe(user => renderSuggestion(user, '.suggestion1'))
createSuggestionStream(close2ClickStream).subscribe(user => renderSuggestion(user, '.suggestion2'))
createSuggestionStream(close3ClickStream).subscribe(user => renderSuggestion(user, '.suggestion3'))
