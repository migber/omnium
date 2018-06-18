connect to db via cli :
 psql -h ec2-79-125-110-209.eu-west-1.compute.amazonaws.com -p 5432 -U zvlkylriahtbwp  dsi1lrs6la958


## Api docs

# Events

GET Endpoints:
- '/api/events' - returns all the events
- '/api/events/:id' - returns specific event

# Races

GET endpoints:
- '/api/events/:eventId/races' - returns all races
- '/api/events/:eventId/races/:raceId' - returns specific race

# Scores

GET endpoints:
- '/api/events/:eventId/races/:raceId/scores' - returns all scores of specific event and race
- '/api/events/:eventId/races/:raceOrder/scores/category/:cat/overall' - returns overall standings
- '/api/events/:eventId/races/:raceId/scores/category/:cat' - returns scores based on category, races and event (the most used endpoint) be careful "raceId" is race order.
- '/api/events/:eventId/races/:raceId/scores/:scoreId' - returns specific score


# Races order ids
- 0 - overall
- 1 - scratch race
- 2 - tempo race
- 3 - elimination race
- 4 - point race (in point race we are using 0, because point race submits all overall)