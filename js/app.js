(function() {

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

	firebase.database().ref('tasks/').on('value', function(snapshot) {
		// Pull the list value from firebase
		state.list = snapshot.val();
		renderArticle(state, container)
	});

	var state = {
			overwatchApi : "",
			overwatchPlayerApi: "",
			gamesPlayed: "",
			gamesWon: "",
			timePlayed: "",
			soloKills: "",
			playerIcon: "",
			playerLevel: ""
	}

	var container = document.querySelector('.lfg-container')


	delegate('.dark-background','click','.yellow-btn', (event) => {
		event.preventDefault()
		var playertagValue = document.querySelector('#player-tag').value
		var platformValue = document.querySelector('#platform-value').value
		var regionValue = document.querySelector('#region-value').value
		var gameModeValue = document.querySelector('#gamemode-value').value
		var container = document.querySelector('.lfg-container')
		state.notesValue = document.querySelector('#notes-value').value
		state.overwatchApi =  "https://api.lootbox.eu/" + platformValue + "/" + regionValue + "/" + playertagValue + "/" + gameModeValue + "/allHeroes/"
		state.overwatchPlayerApi = "https://api.lootbox.eu/" + platformValue + "/" + regionValue + "/" + playertagValue + "/profile"
		overwatchFetch()
	})

	function overwatchFetch(){
		renderLoading(container)
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
			renderArticle(state, container)
		})
		.catch((err)=>{
			alert("The OverwatchPlayer API returned this error:" + err)
		})
	}
	
	function renderArticle(state, container) {
		container.innerHTML = Object.keys(state.list).map((key) => {
			return	`<table class="col-xs-12 margin-top lfg-row">
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
		}).join('');
	}

	function renderLoading(into) {
		container.innerHTML = `<div id="pop-up" class="loader"></div>`
	}

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


