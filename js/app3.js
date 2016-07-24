(function() {

var container = document.querySelector('.lfg-container')



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

delegate('.submit-input','click','.yellow-btn', () => {
	event.preventDefault()
	var playertagValue = document.querySelector('#player-tag').value
	var platformValue = document.querySelector('#platform-value').value
	var regionValue = document.querySelector('#region-value').value
	var gameModeValue = document.querySelector('#gamemode-value').value
	state.notesValue = document.querySelector('#notes-value').value
	var container = document.querySelector('.lfg-container')
	console.log(playertagValue)
	state.overwatchApi =  "https://api.lootbox.eu/" + platformValue + "/" + regionValue + "/" + playertagValue + "/" + gameModeValue + "/allHeroes/"
	state.overwatchPlayerApi = "https://api.lootbox.eu/" + platformValue + "/" + regionValue + "/" + playertagValue + "/profile"
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
		renderArticle(state, container)

		firebase.database().ref('test/').push({
		playerIcon: state.playerIcon,
		playerLevel: state.playerLevel,
		playerTag: playertagValue,
		notesValue: state.notesValue
	});
	})
	.catch((err)=>{
		alert("The OverwatchPlayer API returned this error:" + err)
	})


}

function renderArticle(state, container) {
	container.innerHTML += `	
	<table class="col-xs-12 margin-top lfg-row">
		<tr class="well" data-id="${key}">
			<td><img class="player-icon" src="${state.playerIcon}"></td>
			<td class="player-details">
				<h4>${state.playerTag}</h4>
				<h5 class="player-level"><i class="fa fa-star"> </i> <strong>Level:</strong> ${state.playerLevel}</h5>
			</td>
			<td class="looking-for">
				<h4>Looking for Competitive</h4>
				<p>${state.notesValue}</p>
			</td>
			<td class="time-posted">
				<span class="remove pull-right"><i class="fa fa-times"></i></span>
				<span class="time-post">3 minutes ago</span>
			</td>
		</tr>
	</table>
	`
}

// Close pop-up
delegate ('body','click','.delete-row', (into) => {
	deleteRow()
})

function deleteRow(into) {
	var popUp = document.querySelector('.lfg-row')
	popUp.parentNode.removeChild(popUp);
}

})()


