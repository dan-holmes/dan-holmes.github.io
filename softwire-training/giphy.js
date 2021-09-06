const apiKey = '4DyJvGNsexD3ms8sxTAFWrF076Jl1FjM';

async function displayTrending() {
    fetch('http://api.giphy.com/v1/gifs/trending?limit=5&api_key=' + apiKey)
        .then(response => response.json())
        .then(json => json.data)
        .then(trendingGifs => {
            trendingGifs.forEach(gif => {
                const section = document.createElement("section");
                const title = document.createElement("h1");
                const titleNode = document.createTextNode(gif.title);
                title.append(titleNode);
                const image = document.createElement("img");
                image.setAttribute("id", gif.id)
                image.setAttribute("src", gif.images.fixed_height.url)
                image.setAttribute("alt", gif.title)
                section.append(title);
                section.append(image);
                const main = document.getElementById("main");
                main.appendChild(section);
            });
        })
}

document.addEventListener('DOMContentLoaded', function(event) {
    displayTrending();
});