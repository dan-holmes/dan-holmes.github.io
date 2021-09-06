const buttonPresses = [];
const KONAMI_CODE = ['Numpad0', 'Numpad0', 'Numpad7']

document.addEventListener('keypress', logKey);

function logKey(e) {
    buttonPresses.push(e.code);
    checkKonamiCode();
}

function checkKonamiCode()
{
    let recentPresses = buttonPresses.slice(-3);
    if (recentPresses.join() === KONAMI_CODE.join())
    {
        activateKonami();
    }
}

function activateKonami()
{
    playAirhorn();
    flashBackground();
}

function playAirhorn()
{
    var airhorn = new Audio('airhorn.mp3');
    airhorn.play();
    flashBackground(14);
}

function flashBackground(flashes)
{
    let currentBackground = 'D9F7FA';

    colors = ["FF0000", "000000", "AA00EE", "00FF00", "0000FF", "CCCCCC", "FFFFFF"];

    for(let i = 0; i < flashes; i++)
    {
        setTimeout(function() { bgChanger(colors[i%colors.length])}, i*100);
    }

    setTimeout(function() { bgChanger(currentBackground)}, flashes*100);
}

function bgChanger (end) {
    document.body.style.backgroundColor = "#" + end;
}
