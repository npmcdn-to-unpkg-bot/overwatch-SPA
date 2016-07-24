(function() {
  'use strict';

  // Initialize Firebase
  let firebaseAppName = "alexinnes-firebase";
  let firebaseKey = "AIzaSyALk4SqOf183IoFlQohoEucdkLihFkabpU";

  var config = {
	apiKey: firebaseKey,
	authDomain: `${firebaseAppName}.firebaseapp.com`,
	databaseURL: `https://${firebaseAppName}.firebaseio.com`,
	storageBucket: `${firebaseAppName}.appspot.com`,
  };
  firebase.initializeApp(config);

	var container = document.querySelector('.lfg-container')
	let state = {
		list: {
			overwatchApi : "",
			overwatchPlayerApi: "",
			gamesPlayed: "",
			gamesWon: "",
			timePlayed: "",
			soloKills: "",
			playerIcon: "",
			playerLevel: ""
		}
	}

  // Whenever a new value is received from Firebase (once at initial page load,
  // then every time something changes)
	firebase.database().ref('tasks/').on('value', function(snapshot) {
		// Pull the list value from firebase
		state.list = snapshot.val();
		renderArticle(state, container)
	});

  // Clicking to add a new item
document.querySelector('#add-button').addEventListener('click', (event) => {
	// Get the user input
	let value = document.querySelector('#new-item').value;
	// Remove whitespace from start and end of input
	value = value.trim();

	// Nothing entered, return early from this function
	if (!value) {
	  return;
	}
	firebase.database().ref('tasks/').push({
	  title: value,
	  done: false  // Default all tasks to not-done
	});

	// Reset the input value ready for a new item
	document.querySelector('#new-item').value = '';

  });

  // Clicking to delete an item
  delegate('.todo-list', 'click', '.delete', (event) => {

	let key = getKeyFromClosestElement(event.delegateTarget);

	// Remove that particular key
	firebase.database().ref(`tasks/${key}/`).remove();
  });



  function renderList(into, state) {
	// Iterate over each element in the object
	into.innerHTML = Object.keys(state.list).map((key) => {
	  return `
		<li  ${state.list[key].done ? "style='text-decoration: line-through'" : ""}>
		  <input class="done-it" type="checkbox" ${state.list[key].done ? "checked" : ""} />
		  ${state.list[key].title}
		  <button class="delete">[Delete]</button>
		</li>
	  `;
	}).join('');
  }

  // We added the `data-id` attribute when we rendered the items
  function getKeyFromClosestElement(element) {

	// Search for the closest parent that has an attribute `data-id`
	let closestItemWithId = closest(event.delegateTarget, '[data-id]')

	if (!closestItemWithId) {
	  throw new Error('Unable to find element with expected data key');
	}

	// Extract and return that attribute
	return closestItemWithId.getAttribute('data-id');
  }
})();
