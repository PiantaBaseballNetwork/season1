console.log("js loaded");

/* set up variables */
var leagueData;
var tableContents;

/* load json file */
fetch("LeagueData.json")
	.then(response => response.json())
	.then(data => {
		console.log(data)
		leagueData = data
		tableContents = data.Seasons[0].Games
		buildTable(tableContents)
		setStandings(data.Seasons[0].Teams)
	})
	
console.log("JSON loaded:");
console.log(leagueData);

/* functions */

function setStandings(_data)
{
	var data = _data.sort((a,b) => a.GamesWon < b.GamesWon ? 1 : -1)
	var standingsTableHeader = document.getElementById('standingstableheader')
	standingsTableHeader.innerHTML = '';
	
	var headerRow = `<tr>
		<th data-column="TeamName">Team</th>
		<th data-column="GamesWon">W</th>
		<th data-column="GamesLost">L</th>
	</tr>`
		
	standingsTableHeader.innerHTML += headerRow
	
	var standingsTableBody = document.getElementById('standingstablebody')
	standingsTableBody.innerHTML = '';
	
	for(var i = 0; i < data.length; i++)
	{
		var row = `<tr>
			<td>${data[i].TeamName}</td>
			<td>${data[i].GamesWon}</td>
			<td>${data[i].GamesLost}</td>
		</tr>`
		
		
		standingsTableBody.innerHTML += row
	}
}

function buildTable(data)
{
	console.log("building table")	
	
	/* create headers */
	var tableHeader = document.getElementById('tableheader')
	tableHeader.innerHTML = '';
		
	var headerRow = `<tr>
		<th data-column="HomeTeam">Home</th>
		<th data-column="HomeScore">Score(H)</th>
		<th data-column="AwayTeam">Away</th>
		<th data-column="AwayScore">Score(A)</th>
		<th data-column="InningsPlayed">Innings</th>
		<th data-column="Stadium">Stadium</th>
		<th data-column="Date">Date</th>
	</tr>`
		
		tableHeader.innerHTML += headerRow
		
	/* create rows */
	var tableBody = document.getElementById('tablebody')
	tableBody.innerHTML = ''
	
	for(var i = 0; i < data.length; i++)
	{
		var row = `<tr>
			<td>${data[i].HomeTeam}</td>
			<td>${data[i].HomeScore}</td>
			<td>${data[i].AwayTeam}</td>
			<td>${data[i].AwayScore}</td>
			<td>${data[i].InningsPlayed}</td>
			<td>${data[i].Stadium}</td>
			<td>${data[i].Date}</td>
		</tr>`
	
		tableBody.innerHTML += row
	}
}