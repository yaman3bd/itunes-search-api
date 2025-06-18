## Getting Started

```bash
git clone git@github.com:yaman3bd/itunes-search-api.git
cd itunes-search-api
pnpm install
```

## Running Locally
Create a file named `.env` in the project root with the following content:
```base
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:5432/itunes_search_api"
```
Replace <USER>, <PASSWORD>, and <HOST> with your database credentials.

Then, run the database migrations
```
npx prisma migrate && npx prisma generate
```
Finally, run the development server:

```bash
npm run start:dev
```

### Running with Docker (Alternative)
Install Docker: Ensure you have Docker and Docker Compose installed on your machine.
```bash
docker-compose up --build
```

### Finally
Open [http://localhost:3000/podcasts/search?term=فنجان](http://localhost:3000/podcasts/search?term=فنجان) in your browser to see the app in action.

### API Docs
You can view the API documentation at [http://localhost:3000/api/docs](http://localhost:3000/api/docs).


