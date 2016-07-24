(function() {

var container = document.querySelector('.lfg-container')

// Clicking to add a new item
document.querySelector('#add-button').addEventListener('click', (event) => {

	
	// Remove whitespace from start and end of input
	value = value.trim();

	// Nothing entered, return early from this function
	if (!value) {
	  return;
	}

	firebase.database().ref('tasks/').push({
		playerIcon: value,
		playerLevel: value,
		playerTag: playertagValue,
		notesValue: value
	});
	// Reset the input value ready for a new item
	document.querySelector('#player-tag').value = '';
	document.querySelector('#notes-values').value = '';
});

var state = {
	overwatchApi : "",
	overwatchPlayerApi: "",
	gamesPlayed: "",
	gamesWon: "",
	timePlayed: "",
	soloKills: "",
	playerIcon: "",
	playerLevel: "",
	playerTag: ""
}

delegate('.submit-input','click','.yellow-btn', () => {
	event.preventDefault()
	var playertagValue = document.querySelector('#player-tag').value
	var platformValue = document.querySelector('#platform-value').value
	var regionValue = document.querySelector('#region-value').value
	var gameModeValue = document.querySelector('#gamemode-value').value
	var container = document.querySelector('.lfg-container')
	state.notesValue = document.querySelector('#notes-value').value
	state.overwatchApi =  "https://api.lootbox.eu/" + platformValue + "/" + regionValue + "/" + playertagValue + "/" + gameModeValue + "/allHeroes/"
	state.overwatchPlayerApi = "https://api.lootbox.eu/" + platformValue + "/" + regionValue + "/" + playertagValue + "/profile"


	
	// Reset the input value ready for a new item
	document.querySelector('#player-tag').value = '';
	document.querySelector('#notes-values').value = '';


	overwatchFetch()
})

function overwatchFetch(){
	fetch(state.overwatchApi)
	.then((response) => {
		return response.json()
	})
	.then((result) => {
		state.gamesPlayed = result.GamesPlayed
		state.gamesWon = result.GamesWon
		state.timePlayed = result.TimePlayed
		state.soloKills = result.SoloKills
	})
	.catch((err)=>{
		alert("The Overwatch API returned this error:" + err)
	})

	fetch(state.overwatchPlayerApi)
	.then((response) => {
		return response.json()
	})
	.then((result) => {
		state.playerIcon = result.data.avatar
		state.playerTag = result.data.username
		state.playerLevel = result.data.level

		firebase.database().ref('tasks/').push({
		playerIcon: state.playerIcon,
		playerLevel: state.playerLevel,
		playerTag: playertagValue,
		notesValue: state.notesValue
	});
		renderArticle(state, container)
	})
	.catch((err)=>{
		alert("The OverwatchPlayer API returned this error:" + err)
	})
}

function renderArticle(state, container) {
	into.innerHTML = Object.keys(state.list).map((key) => {
	`<table class="col-xs-12 margin-top lfg-row">
		<tr class="well" data-id="${key}">
			<td><img class="player-icon" src="${state.list[key].playerIcon}"></td>
			<td class="player-details">
				<h4>${state.list[key].playerTag}</h4>
				<h5 class="player-level"><i class="fa fa-star"> </i> <strong>Level:</strong> ${state.list[key].playerLevel}</h5>
			</td>
			<td class="looking-for">
				<h4>Looking for Competitive</h4>
				<p>${state.list[key].notesValue}</p>
			</td>
			<td class="time-posted">
				<span class="remove pull-right"><i class="fa fa-times"></i></span>
				<span class="time-post">3 minutes ago</span>
			</td>
		</tr>
	</table>
	`
	}).join('')
}

// Delete listing
	delegate('.todo-list', 'click', '.delete', (event) => {
		let key = getKeyFromClosestElement(event.delegateTarget);
		// Remove that particular key
		firebase.database().ref(`tasks/${key}/`).remove();
	});


	function getKeyFromClosestElement(element) {
		// Search for the closest parent that has an attribute `data-id`
		let closestItemWithId = closest(event.delegateTarget, '[data-id]')
		if (!closestItemWithId) {
		  throw new Error('Unable to find element with expected data key');
		}
		// Extract and return that attribute
		return closestItemWithId.getAttribute('data-id');
	}

})()


