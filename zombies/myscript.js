var i = 0;
var points = 0;
var noWords = 0;
var text = "";
var t = 0;
lastCreated = 0;
var noCreated = 0;
var lives = 3;
var interval;
var instakill = 0;
var rate = 1;
var lostGap = 0;
var waveGap;
var wave = 1;
var gameEnded = false;

var words = new Array();
var wordsColored = new Array();
var wordsPosition = new Array();

var dyingZombies = new Array();

nameDB = new Array(
"DAN","DAN","DAN",
"JAMIE","JAMIE","JAMIE",
"LINDA","LINDA","LINDA",
"COLIN","COLIN","COLIN",
"JOSH","JOSH","JOSH",
"JACK","JACK","JACK",
"ALEX","ALEX","ALEX",
"JONNY","JONNY","JONNY",
"ALICE","ALICE","ALICE",
"BETH","BETH","BETH",
"ADAM","ADAM","ADAM",
"EFFY","EFFY","EFFY",
"BEN","BEN","BEN",
"JOE","JOE","JOE",
"INSTAKILL",
"OBLITERATE",
"REGENERATE"
)

var currentWord;  

$(document).ready(function(){
	preload(
		"images/background.png",
		"images/zombie1.png",
		"images/zombie2.png",
		"images/zombie3.png",
		"images/zombie4.png",
		"images/zombie5.png",
		"images/zombie6.png",
		"images/zombie7.png",
		"images/zombie8.png",
		"images/zombieD1.png",
		"images/zombieD2.png",
		"images/zombieD3.png",
		"images/zombieD4.png",
		"images/zombieD5.png",
		"images/zombieD6.png",
		"images/zombieD7.png",
		"images/zombieD8.png"
	)
	
	$(window).load(function(){
		
		interval = setInterval(increaseT,10);
	
		$(document).keydown(function(e){
			if(i == 0)
			{
				for(y in words)
				{
					if(typeof words[y] != "undefined")
					{
						if(words[y][0] == String.fromCharCode(e.which))
						{
							if(instakill == 0)
							{
								currentWord = y;
								i = 1;
								wordsColored[currentWord] = i;
								printCanvas();
								break;
							} else {
								currentWord = y;
								killZombie(currentWord, true)
								printCanvas();
								break;
							}
						}
					}
				}
			} else {
				if(String.fromCharCode(e.which) == words[currentWord][i])
				{
					i++;
					wordsColored[currentWord] = i;
					
					if(i == words[currentWord].length)
					{
						killZombie(currentWord, true);
					}
					printCanvas();
				}
			}
		});
	
	});
	


});