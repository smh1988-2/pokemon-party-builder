
const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
let myParty = [];

//fetch any pokemon from the local server and render them
fetch("http://localhost:3000/pokemons")
  .then((resp) => resp.json())
  .then((data) => {
    myParty.push(data);
    for (i = 0; i < myParty[0].length; i++) {
      renderMyParty(myParty[0][i]);
    }
  });

//variables to help render to the DOM
const searchResultsContainer = document.getElementById(
  "search-results-cointainer"
);
const firstPartyMember = document.getElementById("firstPartyMember");
const typeEffectivenessContainer =
  document.getElementById("type-effectiveness");
let pokeQuery = null;
let partyMemberCard = document.createElement("div");
const pokeCard = document.createElement("div");

//event listeners for search and clicking the Random link.
const form = document.getElementById("poke-search-form");
form.addEventListener("submit", (e) => pokeSearch(e));

const pickRandomPokemon = document.getElementById("randomPokemon");
pickRandomPokemon.addEventListener("click", (e) => searchForRandomPokemon(e));

function loadingAnimation() {
  pokeCard.innerHTML = `<img src="Spinner-1s-200px.gif" alt="loading gif" class="img-fluid rounded mx-auto d-block"/>`;
  searchResultsContainer.append(pokeCard);
}

function searchForRandomPokemon() {
  let randomPokemonId = Math.floor(Math.random() * 901); //there are 901 pokemon!
  loadingAnimation();
  fetch(BASE_URL + randomPokemonId)
    .then((resp) => resp.json())
    .then((data) => {
      setTimeout(function () {
        renderPokemon(data);
      }, 2000);
    });
}

function pokeSearch(e) {
  e.preventDefault();
  pokeQuery = e.srcElement[0].value;
  pokeQuery = pokeQuery.toLowerCase(); //query needs to be in all lowercase to match the API
  loadingAnimation();
  fetch(`${BASE_URL}${pokeQuery}`)
    .then((resp) => resp.json())
    .then((data) => {
      setTimeout(function () {
        renderPokemon(data);
      }, 2000);
    })
    .catch(() => {
      alert("That's not a Pokemon!"); //Shows alert if the search query doesn't match a Pokemon in the API
    });
  form.reset();
}

function renderPokemon(data) {
  const pokePic = data.sprites.other["official-artwork"].front_default;
  const pokeName = data.name.charAt(0).toUpperCase() + data.name.slice(1); //this capitalises the first letter of the string
  const pokeOrder = data.order;
  pokeCard.innerHTML = "";

  //Creating a pokeAbilities variable and then use if/else to render 1-3 abilities
  let pokeAbilities;
  let pokeFirstAbility =
    data.abilities[0].ability.name.charAt(0).toUpperCase() +
    data.abilities[0].ability.name.slice(1);
  let pokeSecondAbility;
  let pokeThirdAbility;
  console.log(data.abilities.length);

  if (data.abilities.length === 1) {
    pokeAbilities = pokeFirstAbility;
  } else if (data.abilities.length === 2) {
    pokeSecondAbility =
      data.abilities[1].ability.name.charAt(0).toUpperCase() +
      data.abilities[1].ability.name.slice(1);
    pokeAbilities = `${pokeFirstAbility} / ${pokeSecondAbility}`;
  } else {
    pokeSecondAbility =
      data.abilities[1].ability.name.charAt(0).toUpperCase() +
      data.abilities[1].ability.name.slice(1);
    pokeThirdAbility =
      data.abilities[2].ability.name.charAt(0).toUpperCase() +
      data.abilities[2].ability.name.slice(1);
    pokeAbilities = `${pokeFirstAbility} / ${pokeSecondAbility} / ${pokeThirdAbility}`;
  }

  //Creating a pokeType variable and use an if/then to render 1 or 2 types
  let pokeType;
  let pokeType1 =
    data.types[0].type.name.charAt(0).toUpperCase() +
    data.types[0].type.name.slice(1);
  let pokeType2;
  if (data.types.length === 1) {
    pokeType = pokeType1;
  } else {
    pokeType2 =
      data.types[1].type.name.charAt(0).toUpperCase() +
      data.types[1].type.name.slice(1);
    pokeType = `${pokeType1} / ${pokeType2}`;
  }

  const hp = data.stats[0].base_stat;
  const attack = data.stats[1].base_stat;
  const defense = data.stats[2].base_stat;
  const specialAttack = data.stats[3].base_stat;
  const specialDefense = data.stats[4].base_stat;
  const speed = data.stats[5].base_stat;

  pokeCard.innerHTML = `
          <div class="card center-block" id="top-card">
            <img src="${pokePic}" alt="searchResultsContainer" width="50%" class="img-fluid rounded mx-auto d-block">
            <div class="card-body center-block">
              <h3 class="card-title text-center" id="header-poke-name">${pokeName}</h5>
              <p class="card-text text-center">${pokeType}</p>
            </div>
            
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Number: ${pokeOrder}</li>
              <li class="list-group-item">Abilities: ${pokeAbilities}</li>
              <li class="list-group-item">
              <strong>Base Stats:<br /></strong>
              HP: ${hp}<br />
              Attack: ${attack}<br />
              Defense: ${defense}<br />
              Special Attack: ${specialAttack}<br />
              Special Defense: ${specialDefense}<br />
              Speed: ${speed}<br />
              </li>
            </ul>
            <div class="d-grid gap-2 mx-auto">
            <div class="card-body">
               <button type="button" id="addToParty" class="btn btn-warning btn-block">Add to Party</button>
               </div>
            </div>
          </div>
        `;

  searchResultsContainer.append(pokeCard);

  let addToPartyButton = document.getElementById("addToParty");
  addToPartyButton.addEventListener("click", addToParty);

  function addToParty() {
    if (myParty[0].length < 6) {
      fetch("http://localhost:3000/pokemons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            alert("You can only have one of each Pokemon in your party!");
          }
        })
        .then(() => {
          myParty[0].push(data);
          getMyParty();
        });
    } else {
      alert("You already have 6 Pokemon in your party!");
    }
    callType(data);
  }
}

// render the party every time the party is edited
function getMyParty() {
  firstPartyMember.innerHTML = "";
  myParty[0].forEach((partyMember) => renderMyParty(partyMember));
  teamStats.innerHTML = "";
}

function renderMyParty(member) {
  let partyMemberCard = document.createElement("div");
  partyMemberCard.className = "col-2";

  let memberName = member.name.charAt(0).toUpperCase() + member.name.slice(1);
  let memberType = null;
  let pokeType1 =
    member.types[0].type.name.charAt(0).toUpperCase() +
    member.types[0].type.name.slice(1);
  let pokeType2;
  if (member.types.length === 1) {
    memberType = pokeType1;
  } else {
    pokeType2 =
      member.types[1].type.name.charAt(0).toUpperCase() +
      member.types[1].type.name.slice(1);
    memberType = `${pokeType1} / ${pokeType2}`;
  }

  let memberImage = member.sprites.other["official-artwork"].front_default;

  let typeEffectivenessButton = document.createElement("button");
  typeEffectivenessButton.className =
    "btn btn-outline-warning center-block col-10";
  typeEffectivenessButton.id = "typeEffectivenessButton";
  typeEffectivenessButton.textContent = "Type Effectiveness";
  typeEffectivenessButton.addEventListener("click", () => callType(member));

  let deleteButton = document.createElement("button");
  deleteButton.className = "btn btn-outline-danger center-block col-10";
  deleteButton.id = "deleteButton";
  deleteButton.textContent = "Remove";
  deleteButton.addEventListener("click", () => removeFromParty(member));

  partyMemberStatsHolder = document.createElement("p");

  partyMemberCard.innerHTML = ` 
  <div class="col-6 card d-inline border-0" style="width: 16%;">
    <div class="border-0">
    <img src="${memberImage}" alt="..." class="card-img-top">
    <div class="card-body">
    <h5 class="card-title">${memberName}</h5>
    <p class="card-text">Type: ${memberType}</p>
    </div>
    </div>
    </div>
    `;
  partyMemberCard.append(typeEffectivenessButton);
  partyMemberCard.append(deleteButton);
  firstPartyMember.append(partyMemberCard);
}

function removeFromParty(pokemonToRemove) {
  myParty.splice(pokemonToRemove.id, 1);
  firstPartyMember.innerHTML = "";

  fetch(`http://localhost:3000/pokemons/${pokemonToRemove.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => resp.json())
    .then(() => {
      myParty = [];
      fetch("http://localhost:3000/pokemons") //fetch-ception. Gets the new party and re-renders it.
        .then((resp) => resp.json())
        .then((data) => {
          myParty.push(data);
          for (i = 0; i < myParty[0].length; i++) {
            renderMyParty(myParty[0][i]);
          }
        });
    });
  runPartyTotals();
}

function callType(data) {
  typeEffectivenessContainer.innerHTML = "";
  fetch(data.types[0].type.url)
    .then((resp) => resp.json())
    .then((typeData) => typeAttributes(typeData));
}

function typeAttributes(typeData) {
  attributeRepeater(
    typeData.damage_relations.double_damage_to,
    "doubleDamageTo",
    "💪 Double damage to "
  );
  attributeRepeater(
    typeData.damage_relations.half_damage_from,
    "halfDamageFrom",
    "💪 Half damage from "
  );
  attributeRepeater(
    typeData.damage_relations.no_damage_from,
    "noDamageFrom",
    "💪 No damage from "
  );
  attributeRepeater(
    typeData.damage_relations.double_damage_from,
    "doubleDamageFrom",
    "👎 Double damage from "
  );
  attributeRepeater(
    typeData.damage_relations.half_damage_to,
    "halfDamageTo",
    "👎 Half damage to "
  );
  attributeRepeater(
    typeData.damage_relations.no_damage_to,
    "noDamageTo",
    "👎 No damage to "
  );
}

function attributeRepeater(path, attribute, text) {
  for (i = 0; i < path.length; i++) {
    let attribute = document.createElement("p");
    attribute.innerHTML = `${text} <strong>${path[i].name}</strong>`;
    typeEffectivenessContainer.append(attribute);
  }
}

    if (data.types.length === 1) {
    pokeType.innerText = pokeType1
    } else {
        let pokeType2 = data.types[1].type.name
        pokeType.innerText = `${pokeType1} / ${pokeType2}`
    }

    console.log(pokeType)

    container.append(pokeName, pokeType, pokePic)


}
