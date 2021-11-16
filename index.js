const BASE_URL = "https://pokeapi.co/api/v2/pokemon/"
const container = document.getElementById("poke-information")

const form = document.getElementById("poke-search")
form.addEventListener("submit", e => pokeSearch(e))
let pokeQuery

const languageForm = document.getElementById("language-form")
languageForm.addEventListener("change", languageChange)

function languageChange() {
    introText = document.getElementById("intro");
    introText.textContent = "Informacion de la Pokemon"
}


function pokeSearch(e) {
    container.innerHTML = ""

    e.preventDefault();
    pokeQuery = e.target[0].value;
    pokeQuery = pokeQuery.toLowerCase();
    console.log(pokeQuery)

    fetch(`${BASE_URL}${pokeQuery}`)
    .then((resp) => resp.json())
    .then(data => renderPokemon(data))
    .catch(error => { alert("Not a pokemon") })

    form.reset();
}

function renderPokemon(data) {
    console.log(data)

    const pokeName = document.createElement("h2")
    pokeName.innerText = data.name.charAt(0).toUpperCase() + data.name.slice(1) 

    const pokePic = document.createElement("img")
    pokePic.src = data.sprites.other["official-artwork"].front_default

    const pokeType = document.createElement("h4")
    
    let pokeType1 = data.types[0].type.name

    if (data.types.length === 1) {
    pokeType.innerText = pokeType1
    } else {
        let pokeType2 = data.types[1].type.name
        pokeType.innerText = `${pokeType1} / ${pokeType2}`
    }

    console.log(pokeType)

    container.append(pokeName, pokeType, pokePic)


}

