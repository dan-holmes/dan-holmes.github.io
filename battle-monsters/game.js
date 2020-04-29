function setUp() {
	
	var punch = new Move("Punch",25,0,100,"normal");
	var kick = new Move("Kick",50,0,50,"normal");
	var heal = new Move("Heal",0,50,100,"normal");
	var splash = new Move("Splash",0,0,100,"water");
	var watergun = new Move("Watergun",30,0,100,"water");
	var leachseed = new Move("Leachseed",20,10,100,"leaf");
	var flamethrower = new Move("Flamethrower",30,0,100,"fire");
	var tackle = new Move("Tackle",20,0,100,"normal");
	var thunder = new Move("Thunder",50,0,80,"electric");
	var hyperbeam = new Move("Hyperbeam",50,0,100,"normal");
	spawn = new Move("Spawn",0,0,100,"special");
	change = new Move("Change",0,0,100,"special");
	
	pokemon1 = new Pokemon("Electromouse",100,[punch,kick,heal,thunder],"electric");
	pokemon2 = new Pokemon("Wastarter",100,[punch,kick,heal,watergun],"water");
	pokemon3 = new Pokemon("Firetail",100,[punch,kick,heal,flamethrower],"fire");
	pokemon4 = new Pokemon("Bulbuddy",100,[punch,kick,tackle,leachseed],"leaf");
	pokemon5 = new Pokemon("Salmonster",50,[tackle,watergun,splash,punch],"water");
	pokemon6 = new Pokemon("Tautwo",200,[kick,heal,thunder,hyperbeam],"psychic");
	
	pokemon7 = Object.assign({},pokemon1);
	pokemon8 = Object.assign({},pokemon2);
	pokemon9 = Object.assign({},pokemon3);
	pokemon10 = Object.assign({},pokemon4);
	pokemon11 = Object.assign({},pokemon5);
	pokemon12 = Object.assign({},pokemon6);

	
	player1 = new Player("Red");
	player2 = new Player("Blue");
	
	player1.addPokemon(pokemon1);
	player1.addPokemon(pokemon2);
	player1.addPokemon(pokemon3);
	player1.addPokemon(pokemon4);
	player1.addPokemon(pokemon5);
	player1.addPokemon(pokemon6);
	
	player2.addPokemon(pokemon9);
	player2.addPokemon(pokemon7);
	player2.addPokemon(pokemon8);
	player2.addPokemon(pokemon10);
	player2.addPokemon(pokemon11);
	player2.addPokemon(pokemon12);
	
	player1.activePokemon = player1.party[0];
	player2.activePokemon = player2.party[0];
	
	player1.opponent = player2;
	player2.opponent = player1;
	
	draw();
	drawInput();
}

function playTurn()	{
	document.getElementById('output').innerHTML = "";
	
	if (player1.instruction[0] == "" || player2.instruction[0] == "")
	{
		return;
	}
	
	if (player1.instruction[1].name == "Spawn")
	{
		doInstruction(player1);
	} else if (player2.instruction[1].name == "Spawn")
	{
		doInstruction(player2);
	} else if((Math.random()>0.5 || player1.instruction[1] == change) && player2.instruction[1] != change)
	{
		doInstruction(player1);
		doInstruction(player2);
	} else {
		doInstruction(player2);
		doInstruction(player1);
	}
	
	if (player2.activePokemon.hp == 0)
	{
		if(player2.isDefeated()) {endGame(player1); return;}
		newPokemon = player2.getAvailablePokemon()[Math.floor(Math.random()*player2.getAvailablePokemon().length)];
		player2.changePokemon(newPokemon,1);
		player1.setInstruction(player1.activePokemon,0);
		playTurn();
	}
	
	if (player1.activePokemon.hp == 0)
	{
		if (player1.isDefeated()) {endGame(player2); return;}
	}
	
	draw();
	drawInput();
}

function endGame(winner)
{
	if (winner == player1)
		document.getElementById('battle').innerHTML = "<p style='font-size: 30'>You win!</p>";
	else
		document.getElementById('battle').innerHTML = "<p style='font-size: 30'>You lose.</p>";
	
	document.getElementById('input').innerHTML = "<button onclick='setUp()'>Play Again</button>"
	document.getElementById('output').innerHTML = "";
}

function giveInstruction(moveNumber)
{
	movingPokemon1 = player1.activePokemon;
	
	move = player1.activePokemon.moves[moveNumber];
	player1.setInstruction(movingPokemon1,move);
	
	aiInstruction();
		
	playTurn();
}

function aiInstruction()
{
	player2.setInstruction(player2.activePokemon,player2.activePokemon.moves[Math.floor(Math.random()*4)]);	
}
	

function doInstruction(player)	{
	var attacker = player.instruction[0];
	var defender = player.opponent.activePokemon;
	var move = player.instruction[1];
	
	if (attacker.hp == 0) { return; }
	
	if (move.name == "Change" || move.name == "Spawn")
	{
		if (player == player1)
		{
			document.getElementById('output').innerHTML += "Go " + attacker.name + "!<br /><br />";
		} else {
			document.getElementById('output').innerHTML += "The opponent sent out " + attacker.name + ".<br /><br />";
		}
		return;
	}
	
	effectiveness = isEffective(move.type,defender.type);
	
	damage = move.damage*effectiveness;

	if (typeof move.name !== 'undefined') 
	{
		document.getElementById('output').innerHTML += attacker.name + " uses " + move.name + ". <br />";
	}
	
	
	if (move.accuracy < Math.random()*100) {
		document.getElementById('output').innerHTML +=attacker.name + "\'s attack missed. <br />";
	}
	else {
		if (move.heals > 0)
		{
			heals = move.heals;
			if (attacker.hp + heals > attacker.maxHp) { heals = attacker.maxHp - attacker.hp; }
			attacker.hp += heals;
			document.getElementById('output').innerHTML +=attacker.name + " heals " + heals + "hp. <br />";
			document.getElementById('output').innerHTML +=attacker.name + " now has " + attacker.hp + "hp. <br />";
		}
		if (damage > 0)
		{
			if (effectiveness > 1)
				document.getElementById('output').innerHTML += "It's super effective! ";
			else if (effectiveness < 1)
				document.getElementById('output').innerHTML += "It's not very effective... ";
			
			if (defender.hp - damage > 0)
			{
				defender.hp -= damage;
				document.getElementById('output').innerHTML += defender.name + " loses " + damage + "hp. <br />";
				document.getElementById('output').innerHTML += defender.name + " now has " + defender.hp + "hp. <br />";
			} else {
				document.getElementById('output').innerHTML += defender.name + " loses " + defender.hp + "hp. <br />";
				defender.hp = 0;
				document.getElementById('output').innerHTML += defender.name + " fainted.";
			}
		}
	}
	document.getElementById('output').innerHTML +="<br />";
}

function selectPokemon(partyPosition) {
	newPokemon = player1.party[partyPosition];
	
	if (newPokemon.hp == 0) return;
	
	if (newPokemon == player1.activePokemon) {draw(); return;};
	
	if (player1.activePokemon.hp == 0) fromFaint = true; else fromFaint = false;
	
	player1.changePokemon(newPokemon,fromFaint);
	
	aiInstruction();
	
	playTurn();
}



function draw() {
	
	
	document.getElementById('battle-top').innerHTML = "";
	document.getElementById('battle-middle').innerHTML = "";
	document.getElementById('battle-bottom').innerHTML = "";
	
	if (player1.activePokemon.hp == 0)
	{
		showParty();
		return;
	}
	
	for (i=1;i<= Math.floor(player2.activePokemon.hp/player2.activePokemon.maxHp*40);i++) { document.getElementById('battle-top').innerHTML += "-"}
	document.getElementById('battle-top').innerHTML += "<br />";
	document.getElementById('battle-top').innerHTML += "HP: " + player2.activePokemon.hp + "/" + player2.activePokemon.maxHp +  "<br />";
	document.getElementById('battle-top').innerHTML += player2.activePokemon.name + "<br />";
	
	for (i=0;i<=6;i++){document.getElementById('battle-middle').innerHTML += "<br />"};

	document.getElementById('battle-bottom').innerHTML += player1.activePokemon.name + "<br />";
	document.getElementById('battle-bottom').innerHTML += "HP: " + player1.activePokemon.hp + "/" + player1.activePokemon.maxHp + "<br />";
	for (i=1;i<= Math.floor(player1.activePokemon.hp/player1.activePokemon.maxHp*40);i++) { document.getElementById('battle-bottom').innerHTML += "-"}
}

function drawInput() {
	document.getElementById('input').innerHTML = "";
	i = 0;
	for (let move of player1.activePokemon.moves) {document.getElementById('input').innerHTML += "<button onclick='giveInstruction(" + i + ")'>" + move.name + "</button>"; i++;}
	document.getElementById('input').innerHTML +="<button onclick='showParty()'>Change Pokemon</button>";
}
	
function showParty() {
	document.getElementById('battle-top').innerHTML = "";
	document.getElementById('battle-middle').innerHTML = "";
	document.getElementById('battle-bottom').innerHTML = "";
	
	i = 0;
	
	for (let pokemon of player1.party) {
		document.getElementById('battle-middle').innerHTML += "<div style='border-style: dotted'><a onclick='selectPokemon(" + i + ")'>" + pokemon.name + "</a><br />HP:" + pokemon.hp + "/" + pokemon.maxHp + "<br /><div />";
		i++;
	}
}
	
	

function Player(name)	{
	this.name = name;
	this.party = [];
	this.instruction = [];
	this.opponent;
	this.activePokemon;
	
	this.getAvailablePokemon = function() {
		availablePokemon = [];
		for (let pokemon of this.party)
		{
			if (pokemon.hp > 0) availablePokemon.push(pokemon);
		}
		return availablePokemon;
	}
	this.isDefeated = function() {
		if (this.getAvailablePokemon().length == 0) return true; else return false;
	}
	
	this.addPokemon = function(pokemon) {this.party.push(pokemon)};
	this.setInstruction = function(pokemon,move) {this.instruction = [pokemon,move]};
	this.changePokemon = function changePokemon(pokemon,fromFaint) {
		this.activePokemon = pokemon;		
		if (fromFaint)	
			this.setInstruction(this.activePokemon,spawn);
		else
			this.setInstruction(this.activePokemon,change);
		}
}

function Pokemon(name,maxHp,moves,type) {
	this.name = name;
	this.hp = maxHp;
	this.maxHp = maxHp;
	this.moves = moves;
	this.type = type;
}

function Move(name,damage,heals,accuracy,type) {
	this.name = name;
	this.damage = damage;
	this.heals = heals;
	this.accuracy = accuracy;
	this.type = type;
}

function isEffective(attackingType,defendingType)
{
	table = [
	["water","fire"],
	["fire","leaf"],
	["leaf","water"],
	["electric","water"]
	]

	
	for (const pair of table)
	{
		if (pair[0] == attackingType && pair[1] == defendingType)
			return 1.5;
		else if (pair[1] == attackingType && pair[0] == defendingType)
			return 0.5;
	}
	
	return 1;
}
	