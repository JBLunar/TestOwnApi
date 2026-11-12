//Write cool JS hwere!
// URL'en til MIN egen Node/Express server (projektet NodeJS-fun)
// Serveren SKAL køre (npm run dev) i det andet VS Code vindue, ellers kan vi ikke hente noget
const url = "http://localhost:4000/";

// Find containeren i HTML'en, hvor spillene skal vises
// "games" = den tomme boks på siden (<section id="Games">) – IKKE selve spil-dataen
// Id'et skal staves præcis som i HTML'en (stort G), fordi JS skelner mellem store og små bogstaver
const games = document.getElementById("Games");

// Kald funktionen, så hentningen starter, når siden indlæses
// Det virker selvom funktionen står længere nede, fordi "function"-erklæringer bliver "hoisted" (løftet op) af JavaScript
fetchData();

// "async" betyder, at funktionen må bruge "await" – altså vente på ting, der tager tid (som netværk)
async function fetchData() {
  // try = "prøv at gøre det her" – hvis noget går galt, hopper vi ned i catch
  try {
    // Send en forespørgsel til serveren og VENT på svaret
    // Hvis du får en CORS-fejl her: tjek at serveren har app.use(cors()) og er genstartet
    const response = await fetch(url);

    // response.ok er true, hvis statuskoden er 200-299 (alt gik godt)
    // Hvis ikke, laver vi selv en fejl, så vi hopper ned i catch
    if (!response.ok) {
      throw new Error("Request failed");
    }

    // Lav svaret (JSON-tekst) om til et rigtigt JavaScript-objekt
    // data ser sådan ud: { games: [ {...}, {...}, ... ] }
    const data = await response.json();
    console.log(data);

    // Gå igennem hvert spil i listen
    // data = hele objektet, data.games = selve arrayet med spillene
    // "game" er et navn, jeg selv har valgt – det er "det nuværende spil" i hver runde af loopet
    // Loopet SKAL stå inde i try, fordi "data" kun findes herinde (scope)
    data.games.forEach((game) => {
      // Tilføj et "kort" for hvert spil med alle oplysninger
      // += betyder "læg til" – uden + ville hvert spil overskrive det forrige, og kun det sidste blev vist
      // Backticks (`) gør, at vi kan skrive HTML over flere linjer og indsætte værdier med ${...}
      games.innerHTML += `
        <article class="game-card">
          <h2>${game.title}</h2>
          <p>Genre: ${game.genre}</p>
          <p>Udgivet: ${game.releaseYear}</p>
          <!-- "? :" er en mini if/else (ternary): er multiplayer true? så "Ja", ellers "Nej" -->
          <p>Multiplayer: ${game.multiplayer ? "Ja" : "Nej"}</p>
          <p>Rating: ${game.rating} / 10</p>
        </article>
      `;
    });
  } catch (error) {
    // Hertil kommer vi, hvis NOGET gik galt i try:
    // serveren kører ikke, CORS blokerer, eller vi selv lavede en fejl med throw
    console.log(error);
  } finally {
    // finally kører ALTID til sidst – uanset om det lykkedes eller fejlede
    console.log("Request finished");
  }
}