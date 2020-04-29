var timestamp = +(new Date());;

function printCanvas()
{
	
	$("canvas").clearCanvas()
	$("canvas").drawImage({
	source: "images/background.png",
	x: 0, y: 0,
	});
	
	$("canvas").drawText({
		fillStyle: "black",
		x: 60, y: 480,
		font: "14pt Verdana, sans-serif",
		align: "left",
		text: "Score: " + points
	});
	
	if(waveGap > 0 || noCreated == 0)
	{
		
		var k = 0;
		for(x in words)
		{
			if(typeof words[x] != "undefined")
			k++
		}
		if(k == 0)
		{
			$("canvas").drawText({
				fillStyle: "black",
				x: 400, y: 230,
				font: "24pt Verdana, sans-serif",
				align: "left",
				text: "Wave " + wave
			});
		}
	} else if (lostGap > 0 && lives > 0)
	{
		$("canvas").drawText({
			fillStyle: "black",
			x: 400, y: 230,
			font: "24pt Verdana, sans-serif",
			align: "left",
			text: "Get Ready"
		});
	}
	
	$("canvas").drawText({
		fillStyle: "black",
		x: 740, y: 480,
		font: "14pt Verdana, sans-serif",
		align: "left",
		text: "Lives: " + lives
	});
	
	if(instakill != 0)
	{
		$("canvas").drawText({
			fillStyle: "black",
			x: 420, y: 480,
			font: "14pt Verdana, sans-serif",
			align: "left",
			text: "Instakill: " + Math.floor(instakill/1000)
		});
	}
	
	if(lives == 0)
	{
		$("canvas").drawText({
			fillStyle: "black",
			x: 400, y: 230,
			font: "24pt Verdana, sans-serif",
			align: "left",
			text: "Game Over"
		});
		gameEnded = true;
		writeForm();
		showGame();
		clearInterval(interval);
	}
	for (j in words)
	{
	if (wordsColored[j] != -1 && typeof words[j] !="undefined")
		{
		if(isSpecial(words[j]))
		{
			var textColor = "white";
			var c = 6;
		} else {
			var textColor = "black";
			var c = 4;
		}
			for (k in words[j])
			{
				if (k < wordsColored[j])
				{
					$("canvas").drawText({
						fillStyle: "red",
						font: "12pt Lucida Console, Monaco, monospace",
						x: (k*14)+wordsPosition[j][0], y: wordsPosition[j][1],
						text:words[j][k]
					});
				} else {	
					$("canvas").drawText({
						fillStyle: textColor,
						font: "12pt Lucida Console, Monaco, monospace",
						x: (k*14)+wordsPosition[j][0], y: wordsPosition[j][1],
						text:words[j][k]
					});
				}
				
				var zombieStep = (wordsPosition[j][0]/16)%7;
				zombieStep = Math.round(zombieStep) + 1;
				$("canvas").drawImage({
					source: "images/zombie" + zombieStep + ".png",
					x: wordsPosition[j][0]+words[j].length*c, y: wordsPosition[j][1]+22,
				});
			}
		}
	}
	
	for (k in dyingZombies)
	{
		zombieDeath = dyingZombies[k][2];
		zombieDeath = zombieDeath - zombieDeath%5;
		zombieDeath = zombieDeath/5;
		if(zombieDeath<=8)
		{
			$("canvas").drawImage({
				source:"images/zombieD" + zombieDeath + ".png",
				x: dyingZombies[k][0], y: dyingZombies[k][1],
			});
			dyingZombies[k][2]++;
		} else {
			dyingZombies.splice(k, 1);
		}
	}
}

function makeWord(word) {
	words[noWords] = word.split("");
	wordsColored[noWords] = 0;
	wordsPosition[noWords] = new Array;
	wordsPosition[noWords][0] = 7;
	wordsPosition[noWords][1] = randomY();
}

function makeRandomWord() {
	var random = Math.floor((Math.random()*nameDB.length)); 
	makeWord(nameDB[random]);
	printCanvas();
	noCreated++;
	noWords++;
	if(noCreated%16 == 0)
	{
		waveGap = 500;
		wave = (noCreated/16)+1;
	}
}

function getWait()
{
x = noCreated;
if(x<16)
{
	x = x/10;
	x = 1.6 - x;
	x = Math.exp(x);
	x = x*1000;
} else if (x<32) {
x = 1000;
} else if (x<48) {
x = 750;
} else if (x<64) {
x = 500;
} else if (x<80) {
x = 350;
} else if (x<96) {
x = 200;
} else if (x<112) {
x = 100;
} else if (x<128) {
x = 100;
rate = 2;
} else {
x = 100;
rate = 3;
}

return x;
}

function increaseT() 
{
	var ntimestamp = +(new Date());
	var deltat = ntimestamp - timestamp;
	timestamp = ntimestamp;
	
	if(t%100 == 0)
	{
		if(waveGap > 0)
		{	
			var k = 0;
			for(x in words)
			{
				if(typeof words[x] != "undefined")
					k++
			}
			if(k == 0)
			{
				waveGap -= deltat;
			}
		} else if (lostGap >0){
				lostGap -= deltat;
		} else	{
			wait = getWait();
			sinceLast = t - lastCreated;
			if (sinceLast > wait)
			{
				if (rate >= 2)
					makeRandomWord();
				if (rate >= 3)
					makeRandomWord();
				makeRandomWord();
				lastCreated = t;
			}
		}
	}
	for(w in words)
	{
		if (typeof words[w] != "undefined" && typeof wordsPosition[w] != "undefined")
		{
			wordsPosition[w][0]+= (0.1 * deltat);
			if(wordsPosition[w][0] > 800) 
			{
				words[w] = undefined;
				wordsPosition[w] = undefined;
				wordsColored[w] = undefined;
				if(currentWord == w)
				{
					currentWord = undefined;
					i=0;
				}
				if(lives !=0)
				{
					lives--;
					killAll(false);
					lostGap = 500;
				}
			}
		}
	}
	
	if(instakill-deltat > 0)
	{
		instakill-=deltat;
	} else {
		instakill = 0;
	}
	
	printCanvas();
	t = t+10;
}

function randomY()
{
height = 500;
return Math.floor((Math.random()*(height-96))) + 8;
}

function killZombie(zombie, shot)
{
	if(shot == true)
	{
		points = points + 100;
		if(arrays_equal(words[zombie], ['I','N','S','T','A','K','I','L','L']))
		{
			instakill = 10000;
		}
		
		if(arrays_equal(words[zombie], ['O','B','L','I','T','E','R','A','T','E']))
		{
			var detonate = true;
		}
		
		if(arrays_equal(words[zombie], ['R','E','G','E','N','E','R','A','T','E']))
		{
			lives++;
		}
		
		length = dyingZombies.length;
		dyingZombies[length] = new Array();
		dyingZombies[length][0] = wordsPosition[zombie][0]+words[zombie].length*4;
		dyingZombies[length][1] = wordsPosition[zombie][1]+22;
		dyingZombies[length][2] = 10;
	}
	
	wordsColored[zombie] = -1;
	words[zombie] = undefined;
	wordsPosition[zombie] = undefined;
	zombie = undefined;
	i = 0;
	
	if(detonate == true)
	{
		killAll(true);
	}
}


function preload() 
{
	var images = new Array;
	for (q = 0; q < preload.arguments.length; q++) {
		images[q] = new Image()
		images[q].src = preload.arguments[q]
	}
}

function killAll(shot)
{
	for (x in words)
	{
		if(typeof words[x] != "undefined")
		{
			killZombie(x, shot);
		}
	}
}

function arrays_equal(a,b) 
{ 
return !(a<b || b<a); 
}

function isSpecial(array)
{
	if(arrays_equal(array, ['I','N','S','T','A','K','I','L','L']) 
	|| arrays_equal(array, ['R','E','G','E','N','E','R','A','T','E'])
	|| arrays_equal(array, ['O','B','L','I','T','E','R','A','T','E']))
	{
		return true;
	} else {
	return false;
	}
}

function showGame()
{
	$(document).ready(function(){
		
             $('#game').css('display', 'inline');
			 $('#highscores').css('display', 'none');
			 if(gameEnded == true)
			 {
				$('#submitScore').css('display', 'inline');
			 }
	}); 
}

function writeForm() {
	$('#subForm').html("<input type='hidden' value='" + points + "' name='points'><input type='hidden' value='" + wave + "' name='wave'>");
}
