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
	})

var t_LazyLurkers = ["Paratroopa(G)", "Magikoopa(B)", "Toad(G)", "Petey", "Dry Bones(G)", "Luigi", "Shy Guy(Bk)", "Goomba", "Shy Guy(Y)"];

var t_BusStopGang = ["Shy Guy(B)", "Koopa(R)", "Boo", "Wario", "Noki(R)", "Pianta(R)", "Magikoopa(R)", "Bro(H)", "Monty"];

var t_BattleToads = ["Toadette", "Toad(P)", "Toadsworth", "Toad(R)", "Peach", "Toad(B)", "Paragoomba", "Toad(Y)", "Baby Luigi"];

var t_BrickSquad = ["Mario", "Yoshi", "Birdo", "Shy Guy(G)", "Baby Mario", "Daisy", "Paratroopa(R)", "Dry Bones(B)", "Waluigi", ];

var t_SunshineStrikers = ["Diddy", "DK", "Bro(B)", "Noki(B)", "Noki(G)", "Pianta(B)", "Shy Guy(R)", "Magikoopa(Y)", "Bowser Jr"];

var t_SacramentoKings = ["Bowser", "Bro(F)", "Magikoopa(G)", "King Boo", "Pianta(Y)", "Dry Bones(R)", "Dixie", "Dry Bones(Gy)", "Koopa(G)"];

var lastClick = -99;
var lastColumn = -99;

var whoFilter = "team";
var statFilter = "batting";
	
console.log("JSON loaded:");
console.log(leagueData);

/* build table for the first time */
buildTable(tableContents, false);

/* functions */
function setClickEvents()
{
	lastClick = -99;
	lastColumn = -99;

	$('th').on('click', function(){
		var column = $(this).data('column')
		var order = $(this).data('order')
		var text = $(this).html()
		text = text.substring(0, text.length -1)
		
		console.log('Click', column, order)
		
		if(lastClick != -99)
		{
			lastText = lastClick.html()
			lastText = lastText.substring(0, lastText.length -1)
			lastText += '&#9642'
			lastClick.html(lastText)
			
			
			lastClick.data('order', "none")
		}
		
		if(order == 'desc' && lastColumn == column){
			$(this).data('order', "asc")
			
			tableContents = tableContents.sort((a,b) => a[column] > b[column] ? 1 : -1)
				
			text += '&#9660'
		}else if(order == 'asc' && lastColumn == column){
			$(this).data('order', "desc")
			
			tableContents = tableContents.sort((a,b) => a[column] < b[column] ? 1 : -1)
				
			text += '&#9650'
		}else{
			$(this).data('order', "desc")
			
			tableContents = tableContents.sort((a,b) => a[column] < b[column] ? 1 : -1)
				
			text += '&#9650'
		}
		
		lastColumn = column;
		lastClick = $(this);
		
		$(this).html(text)
	
		buildTable(tableContents, true);
	})
}

function filterChange()
{
	console.log("filter update");
	
	/* update tableContents using filters */
	var whoRadios = document.getElementsByName("teamorchar");
    whoFilter = Array.from(whoRadios).find(radio => radio.checked).value;
	
	var statRadios = document.getElementsByName("stattype");
    statFilter = Array.from(statRadios).find(radio => radio.checked).value;	
	
	
	/* Filter characters / teams from tableContents */
	tableContents = []
	
	if(whoFilter == "char")
	{
		for(var i = 0; i < leagueData.Seasons[0].Characters.length; i++)
		{
			if((t_SunshineStrikers.includes(leagueData.Seasons[0].Characters[i].CharacterName) && document.getElementById('sunshinestrikerscheck').checked) ||
				(t_BrickSquad.includes(leagueData.Seasons[0].Characters[i].CharacterName) && document.getElementById('bricksquadcheck').checked) ||
				(t_BattleToads.includes(leagueData.Seasons[0].Characters[i].CharacterName) && document.getElementById('battletoadscheck').checked) ||
				(t_BusStopGang.includes(leagueData.Seasons[0].Characters[i].CharacterName) && document.getElementById('busstopgangcheck').checked) ||
				(t_SacramentoKings.includes(leagueData.Seasons[0].Characters[i].CharacterName) && document.getElementById('sacramentokingscheck').checked) ||
				(t_LazyLurkers.includes(leagueData.Seasons[0].Characters[i].CharacterName) && document.getElementById('lazylurkerscheck').checked))
				{
					tableContents.push(leagueData.Seasons[0].Characters[i]);
				}
		}
	}
	else
	{
		for(var i = 0; i < leagueData.Seasons[0].Teams.length; i++)
		{
			if((leagueData.Seasons[0].Teams[i].TeamName == "Sunshine Strikers" && document.getElementById('sunshinestrikerscheck').checked) ||
				(leagueData.Seasons[0].Teams[i].TeamName == "Brick Squad" && document.getElementById('bricksquadcheck').checked) ||
				(leagueData.Seasons[0].Teams[i].TeamName == "Battle Toads?" && document.getElementById('battletoadscheck').checked) ||
				(leagueData.Seasons[0].Teams[i].TeamName == "Bus Stop Gang" && document.getElementById('busstopgangcheck').checked) ||
				(leagueData.Seasons[0].Teams[i].TeamName == "Sacramento Kings" && document.getElementById('sacramentokingscheck').checked) ||
				(leagueData.Seasons[0].Teams[i].TeamName == "Lazy Lurkers" && document.getElementById('lazylurkerscheck').checked))
				{
					tableContents.push(leagueData.Seasons[0].Teams[i]);
				}
		}
	}
	
	/* rebuild table */
	buildTable(tableContents, false);
}

function buildTable(data, justRows)
{
	console.log("building table")
	if(!justRows)
	{		
		/* create headers */
		var tableHeader = document.getElementById('tableheader')
		tableHeader.innerHTML = '';
		
		
		if(whoFilter == "team" && statFilter == "batting")
		{
			var headerRow = `<tr>
				<th data-column="TeamName" data-order="none">Name &#9642</th>
				<th data-column="TeamCaptain" data-order="none">Captain &#9642</th>
				<th data-column="HomeStadium" data-order="none">Stadium &#9642</th>
				
				<th data-column="BattingAVG" data-order="none">Batting AVG &#9642</th>
				<th data-column="OBP" data-order="none">OBP &#9642</th>
				<th data-column="SLG" data-order="none">SLG &#9642</th>
				<th data-column="OPS" data-order="none">OPS &#9642</th>
				
				<th data-column="Hits" data-order="none">Hits &#9642</th>
				<th data-column="Singles" data-order="none">Singles &#9642</th>
				<th data-column="Doubles" data-order="none">Doubles &#9642</th>
				<th data-column="Triples" data-order="none">Triples &#9642</th>
				<th data-column="Homeruns" data-order="none">Homeruns &#9642</th>
				<th data-column="StrikeoutsSwung" data-order="none">Strikeouts(batted) &#9642</th>
				<th data-column="BallWalks" data-order="none">Walks(ball) &#9642</th>
				<th data-column="HitWalks" data-order="none">Walks(hit) &#9642</th>
				<th data-column="TotalScore" data-order="none">Runs &#9642</th>
				<th data-column="BasesStolen" data-order="none">Bases Stolen &#9642</th>
			</tr>`
			
			tableHeader.innerHTML += headerRow
		}
		
		if(whoFilter == "team" && statFilter == "pitching")
		{
			var headerRow = `<tr>
				<th data-column="TeamName" data-order="none">Name &#9642</th>
				<th data-column="TeamCaptain" data-order="none">Captain &#9642</th>
				<th data-column="HomeStadium" data-order="none">Stadium &#9642</th>
				
				<th data-column="ERA" data-order="none">ERA &#9642</th>
				<th data-column="InningsPitched" data-order="none">Innings Pitched &#9642</th>
				<th data-column="StrikeoutsThrown" data-order="none">Strikeouts(pitched) &#9642</th>
				<th data-column="BattersWalked" data-order="none">Batters Walked &#9642</th>
				<th data-column="BattersHit" data-order="none">Batters Hit &#9642</th>
			</tr>`
			
			tableHeader.innerHTML += headerRow
		}
		
		if(whoFilter == "char" && statFilter == "batting")
		{
			var headerRow = `<tr>
				<th data-column="CharacterName" data-order="none">Name &#9642</th>
				<th data-column="GamesPlayed" data-order="none">Games Played &#9642</th>
				
				<th data-column="BattingAVG" data-order="none">Batting AVG &#9642</th>
				<th data-column="OBP" data-order="none">OBP &#9642</th>
				<th data-column="SLG" data-order="none">SLG &#9642</th>
				<th data-column="OPS" data-order="none">OPS &#9642</th>
				
				<th data-column="Hits" data-order="none">Hits &#9642</th>
				<th data-column="Singles" data-order="none">Singles &#9642</th>
				<th data-column="Doubles" data-order="none">Doubles &#9642</th>
				<th data-column="Triples" data-order="none">Triples &#9642</th>
				<th data-column="Homeruns" data-order="none">Homeruns &#9642</th>
				<th data-column="StrikeoutsSwung" data-order="none">Strikeouts(batted) &#9642</th>
				<th data-column="BallWalks" data-order="none">Walks(ball) &#9642</th>
				<th data-column="HitWalks" data-order="none">Walks(hit) &#9642</th>
				<th data-column="BasesStolen" data-order="none">Bases Stolen &#9642</th>
			</tr>`
			
			tableHeader.innerHTML += headerRow
		}
		
		if(whoFilter == "char" && statFilter == "pitching")
		{
			var headerRow = `<tr>
				<th data-column="CharacterName" data-order="none">Name &#9642</th>
				<th data-column="GamesPlayed" data-order="none">Games Played &#9642</th>
				
				<th data-column="ERA" data-order="none">ERA &#9642</th>
				<th data-column="InningsPitched" data-order="none">Innings Pitched &#9642</th>
				<th data-column="StrikeoutsThrown" data-order="none">Strikeouts(pitched) &#9642</th>
				<th data-column="BattersWalked" data-order="none">Batters Walked &#9642</th>
				<th data-column="BattersHit" data-order="none">Batters Hit &#9642</th>
			</tr>`
			
			tableHeader.innerHTML += headerRow
		}
		
		setClickEvents();
	}
	
	/* create rows */
	var tableBody = document.getElementById('tablebody')
	tableBody.innerHTML = ''
	
	if(whoFilter == "team" && statFilter == "batting")
	{
		for(var i = 0; i < data.length; i++)
		{
			var row = `<tr>
				<td>${data[i].TeamName}</td>
				<td>${data[i].TeamCaptain}</td>
				<td>${data[i].HomeStadium}</td>
				
				<td>${data[i].BattingAVG}</td>
				<td>${data[i].OBP}</td>
				<td>${data[i].SLG}</td>
				<td>${data[i].OPS}</td>
				
				<td>${data[i].Hits}</td>
				<td>${data[i].Singles}</td>
				<td>${data[i].Doubles}</td>
				<td>${data[i].Triples}</td>
				<td>${data[i].Homeruns}</td>
				<td>${data[i].StrikeoutsSwung}</td>
				<td>${data[i].BallWalks}</td>
				<td>${data[i].HitWalks}</td>
				<td>${data[i].TotalScore}</td>
				<td>${data[i].BasesStolen}</td>
			</tr>`
		
			tableBody.innerHTML += row
		}
	}
	
	if(whoFilter == "team" && statFilter == "pitching")
	{
		for(var i = 0; i < data.length; i++)
		{
			var row = `<tr>
				<td>${data[i].TeamName}</td>
				<td>${data[i].TeamCaptain}</td>
				<td>${data[i].HomeStadium}</td>
				
				<td>${data[i].ERA}</td>
				<td>${data[i].InningsPitched}</td>
				<td>${data[i].StrikeoutsThrown}</td>
				<td>${data[i].BattersWalked}</td>
				<td>${data[i].BattersHit}</td>
			</tr>`
		
			tableBody.innerHTML += row
		}
	}
	
	if(whoFilter == "char" && statFilter == "batting")
	{
		for(var i = 0; i < data.length; i++)
		{
			var row = `<tr>
				<td>${data[i].CharacterName}</td>
				<td>${data[i].GamesPlayed}</td>
				
				<td>${data[i].BattingAVG}</td>
				<td>${data[i].OBP}</td>
				<td>${data[i].SLG}</td>
				<td>${data[i].OPS}</td>
				
				<td>${data[i].Hits}</td>
				<td>${data[i].Singles}</td>
				<td>${data[i].Doubles}</td>
				<td>${data[i].Triples}</td>
				<td>${data[i].Homeruns}</td>
				<td>${data[i].StrikeoutsSwung}</td>
				<td>${data[i].BallWalks}</td>
				<td>${data[i].HitWalks}</td>
				<td>${data[i].BasesStolen}</td>
			</tr>`
		
			tableBody.innerHTML += row
		}
	}
	
	if(whoFilter == "char" && statFilter == "pitching")
	{
		for(var i = 0; i < data.length; i++)
		{
			var row = `<tr>
				<td>${data[i].CharacterName}</td>
				<td>${data[i].GamesPlayed}</td>
				
				<td>${data[i].ERA}</td>
				<td>${data[i].InningsPitched}</td>
				<td>${data[i].StrikeoutsThrown}</td>
				<td>${data[i].BattersWalked}</td>
				<td>${data[i].BattersHit}</td>
			</tr>`
		
			tableBody.innerHTML += row
		}
	}
}