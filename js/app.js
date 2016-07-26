(function() {

	// Initialize Firebase - Enter your firebase key here...
	let firebaseAppName = "Firebase-Name-Here";
	let firebaseKey = "FirebaseKey-Here";
	var config = {
		apiKey: firebaseKey,
		authDomain: `${firebaseAppName}.firebaseapp.com`,
		databaseURL: `https://${firebaseAppName}.firebaseio.com`,
		storageBucket: `${firebaseAppName}.appspot.com`,
	};
	firebase.initializeApp(config);

	firebase.database().ref('users/').on('value', function(snapshot) {
		// Pull the list value from firebase
		state.users = snapshot.val();
		renderUsers(state, container)
	});
	// End Firebase initialize
	
	var state = {
		overwatchApi : "",
		overwatchPlayerApi: "",
		postTime: ""
	}

	var container = document.querySelector('.lfg-container')
	var getDate = new Date().getTime() / 1000
	state.postTime = getDate

	// Collect all data to perform the render
	delegate('.dark-background','click','.yellow-btn', (event) => {
		event.preventDefault()
		var playertagValue = document.querySelector('#player-tag').value
		var platformValue = document.querySelector('#platform-value').value
		var regionValue = document.querySelector('#region-value').value
		var gameModeValue = document.querySelector('#gamemode-value').value
		var container = document.querySelector('.lfg-container')
		state.gameMode = gameModeValue
		state.notesValue = document.querySelector('#notes-value').value
		state.overwatchApi =  "https://api.lootbox.eu/" + platformValue + "/" + regionValue + "/" + playertagValue + "/" + gameModeValue + "/allHeroes/"
		state.overwatchPlayerApi = "https://api.lootbox.eu/" + platformValue + "/" + regionValue + "/" + playertagValue + "/profile"
		overwatchFetch()
	})

	// Remove specific post
	delegate('.lfg-container', 'click', '.remove', (event) => {
		let key = getKeyFromClosestElement(event.delegateTarget);
		// Remove that particular key
		firebase.database().ref(`users/${key}/`).remove();
	});

	// Update if you've found a group
	delegate('.lfg-container', 'click', '.update', (event) => {
		let key = getKeyFromClosestElement(event.delegateTarget);
		if (!state.users[key].done) {
			firebase.database().ref(`users/${key}/`).update({
				done: event.delegateTarget.checked,
				foundGroup: "show"
			});
		} else {
			firebase.database().ref(`users/${key}/`).update({
				done: false,
				foundGroup: "hide"
			});
		}
	});

	// Unofficial Overwatch  API fetch
	function overwatchFetch(){
		renderLoading(container)
		var f1 = fetch(state.overwatchApi).then((response)=>{return response.json()})
		var f2 = fetch(state.overwatchPlayerApi).then((response)=>{return response.json()})

		Promise.all([f1,f2])
		.then(ress => {
			firebase.database().ref('users/').push({
				gameMode: state.gameMode,
				gamesPlayed: ress[0].GamesPlayed,
				gamesWon: ress[0].GamesWon,
				timePlayed: ress[0].TimePlayed,
				soloKills: ress[0].SoloKills,
				playerIcon: ress[1].data.avatar,
				playerLevel: ress[1].data.level,
				playerTag: ress[1].data.username,
				notesValue: state.notesValue,
				postTime: state.postTime,
				done: false,
				foundGroup: "hide"
			});

			// Reset the input value ready for a new item
			document.querySelector('#player-tag').value = '';
			document.querySelector('#notes-value').value = '';
		})
		.catch((err)=>{
			alert("The OverwatchPlayer API returned this error:" + err)
		})
	}
	
	// Render Looking For Group Post
	function renderUsers(state, container) {
		container.innerHTML = 
		Object.keys(state.users).map((key) => {
			return `<table class="col-xs-12 margin-top lfg-row">
			<tr class="well" data-id="${key}">
				<td class="avatar-container">
					<div class="found-group ${state.users[key].foundGroup}">
						<i class="fa fa-check"></i>
					</div>
					<img class="player-icon" src="${state.users[key].playerIcon}">
				</td>
				<td class="player-details">
					<h4>${state.users[key].playerTag}</h4>
					<h5 class="player-level"><i class="fa fa-star"> </i> <strong>Level:</strong> ${state.users[key].playerLevel}</h5>
					<p><strong>Games Played:</strong> ${state.users[key].gamesPlayed}</p>
					<p><strong>Games Won:</strong> ${state.users[key].gamesWon}</p>
					<p><strong>Time Played:</strong> ${state.users[key].timePlayed}</p>
				</td>
				<td class="looking-for">
					<h4>Looking for: ${state.users[key].gameMode}</h4>
					<p>${state.users[key].notesValue}</p>
				</td>
				<td class="time-posted">
					<span class="remove pull-right"><i class="fa fa-times"></i></span>
					<span class="time-post">${timePosted(state.users[key].postTime)}</span>
					<label class="checkbox-label">I found a group! <input class="update" type="checkbox" ${state.users[key].done ? "checked" : ""} /></label>
				</td>
			</tr>
		</table>
		`
		}).join('');
	}

	// Loading function during fetch (This api is unofficial and is rather slow)
	function renderLoading(into) {
		container.innerHTML = 
		`<div class="second-wrapper">
			<div class="circle-loader">
				<div class="circle circle_four"></div>
				<div class="circle circle_three"></div>
				<div class="circle circle_two"></div>
				<div class="circle circle_one"></div>
			</div>
		</div>`
	}

	// Find closest key function
	function getKeyFromClosestElement(element) {
		let closestItemWithId = closest(event.delegateTarget, '[data-id]')
		if (!closestItemWithId) {
			throw new Error('Unable to find element with expected data key');
		}
		return closestItemWithId.getAttribute('data-id');
	}

	// Time since posted function
	function timePosted(epoch) {
		var secs = ((new Date()).getTime() / 1000) - epoch;
		Math.floor(secs);
		var minutes = secs / 60;
		secs = Math.floor(secs % 60);
		if (minutes < 1) {
			return secs + (secs > 1 ? ' seconds ago' : ' second ago');
		}
		var hours = minutes / 60;
		minutes = Math.floor(minutes % 60);
		if (hours < 1) {
			return minutes + (minutes > 1 ? ' minutes ago' : ' minute ago');
		}
		var days = hours / 24;
		hours = Math.floor(hours % 24);
		if (days < 1) {
			return hours + (hours > 1 ? ' hours ago' : ' hour ago');
		}
		var weeks = days / 7;
		days = Math.floor(days % 7);
		if (weeks < 1) {
			return days + (days > 1 ? ' days ago' : ' day ago');
		}
		var months = weeks / 4.35;
		weeks = Math.floor(weeks % 4.35);
		if (months < 1) {
			return weeks + (weeks > 1 ? ' weeks ago' : ' week ago');
		}
		var years = months / 12;
		months = Math.floor(months % 12);
		if (years < 1) {
			return months + (months > 1 ? ' months ago' : ' month ago');
		}
		years = Math.floor(years);
		return years + (years > 1 ? ' years ago' : ' years ago');
	}

})()