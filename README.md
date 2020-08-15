# lifescore-api by Paul Gorgis

Restful API written in Node.js + Express for live scores and standings for my favourite leagues of football (soccer). Deployed on Heroku. Uses Cloud MongoDB database which stores the data acquired from the API. The API used is [API-Football](https://www.api-football.com/). Due to the limited amount of calls that can be made to the API per day, the data acquired is stored in the database, and the front-end always retrieve data from the database, not directly from the API. The update frequence for ongoing games are four times per hour. Standings, upcoming games and previous games update at midnight. More leagues may be added in the future. Last updated 2020-08-15

Link to lifescore-frontend: [https://github.com/pagorgis/lifescore-api](https://github.com/pagorgis/lifescore-frontend)

## Project setup
```
npm install
npm start OR node server.js
```
