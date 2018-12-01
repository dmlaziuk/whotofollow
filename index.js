// <script src="http://cdnjs.cloudflare.com/ajax/libs/rxjs/2.2.26/rx.js"></script>
// <script src="http://cdnjs.cloudflare.com/ajax/libs/rxjs/2.2.26/rx.async.js"></script>
// <script src="http://cdnjs.cloudflare.com/ajax/libs/rxjs/2.2.26/rx.coincidence.js"></script>
// <script src="http://cdnjs.cloudflare.com/ajax/libs/rxjs/2.2.26/rx.binding.js"></script>
// <script src="http://cdnjs.cloudflare.com/ajax/libs/rxjs/2.2.26/rx.time.js"></script>
// <script src="http://cdnjs.cloudflare.com/ajax/libs/rxjs-dom/2.0.7/rx.dom.js"></script>

import { Observable } from 'rxjs/Rx'
import $ from 'jquery'

const refreshButton = document.querySelector('.refresh')
const closeButton1 = document.querySelector('.close1')
const closeButton2 = document.querySelector('.close2')
const closeButton3 = document.querySelector('.close3')

const refreshClickStream = Observable.fromEvent(refreshButton, 'click')
const close1ClickStream = Observable.fromEvent(closeButton1, 'click')
const close2ClickStream = Observable.fromEvent(closeButton2, 'click')
const close3ClickStream = Observable.fromEvent(closeButton3, 'click')

const requestStream = refreshClickStream.startWith('startup click')
  .map(() => 'https://api.github.com/users?since=' + Math.floor(Math.random() * 500))

const responseStream = requestStream
  .flatMap(requestUrl => Observable.fromPromise($.getJSON(requestUrl)))

const createSuggestionStream = closeClickStream => closeClickStream.startWith('startup click')
  .combineLatest(responseStream, (click, listUsers) => listUsers[Math.floor(Math.random() * listUsers.length)])
  .merge(refreshClickStream.map(() => null))
  .startWith(null)

const suggestion1Stream = createSuggestionStream(close1ClickStream)
const suggestion2Stream = createSuggestionStream(close2ClickStream)
const suggestion3Stream = createSuggestionStream(close3ClickStream)

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

suggestion1Stream.subscribe(suggestedUser => renderSuggestion(suggestedUser, '.suggestion1'))
suggestion2Stream.subscribe(suggestedUser => renderSuggestion(suggestedUser, '.suggestion2'))
suggestion3Stream.subscribe(suggestedUser => renderSuggestion(suggestedUser, '.suggestion3'))
