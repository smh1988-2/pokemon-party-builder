# Pokemon Party Builder
This single page JavaScript app allows a user to create a team of 6 pokemon and see what types of Pokemon they are strong or weak against. We were inspired to build this app because we were both playing Pokemon Sword/Shield and wanted a quick way to see how our team would hold up as the game progressed.

We used the Poke API to get data on all 901 Pokemon. The API gave us names, images, abilities and type effectiveness. The user can search the database and add Pokemon to their team (max of 6 Pokemon). 

There is a local backend (json-server) that saves the user's current team so that it is not lost on reload. 

We used Bootstrap for styling.

### User Stories
- I want to search the database for a Pokemon.
- I want to to see that Pokemon and relevant information, including a picture.
- I want to be able to add that Pokemon to my party and display my entire party (up to 6 Pokemon).
- I want to see the stats, strengths, and weaknesses of every Pokemon in my party.
