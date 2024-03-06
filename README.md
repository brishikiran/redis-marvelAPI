Getting Started
Sign up for Marvel API Key:



Characters Listing: http://localhost:3000/api/characters
Comics Listing: http://localhost:3000/api/comics
Stories Listing: http://localhost:3000/api/stories
Endpoints
GET /api/characters: Returns JSON data of characters from the Marvel API.
GET /api/comics: Returns JSON data of comics from the Marvel API.
GET /api/stories: Returns JSON data of stories from the Marvel API.
Caching with Redis
The server caches API responses in Redis to improve performance and reduce external API requests.
Redis connection details are configured in redis.js.
Technologies Used
Node.js
Express.js
Redis
Marvel API
