# Where is my money? - Expense tracker

This is app is a test design of and expense tracker.
It serves as a design exercise and development exercise in the tools the programs is written.
It is presented as a web-app.
The back-end is written in [Express v4](http://expressjs.com/) and the front-end in [React v17](https://reactjs.org/).

To see the design documents, check the `docs` folder.

---

[TOC]

---

## Features:

- [x] Express adding money as an income.
- [x] Express removing money as an expense.
- [x] Move money between accounts using transfers.
- [x] Organize money in accounts.
- [x] Organize transactions in categories.
- [x] Show current balance and current month incomes and expenses.
- [x] Categories and accounts have a color and an icon for easy identification.
- [x] Filter transactions by month.
- [ ] Filter transactions by accounts.
- [ ] Filter transactions by category.
- [ ] Compute statistics by account, category and date.
- [ ] Recurrent transactions.
- [ ] Multi-currency support.
  - [x] Accounts have currencies.
  - [ ] Set a default currency to display the UI.
  - [ ] Assign conversion rates between currencies.
- [ ] Icon picker.

## How to test?

The client and the server are independent.

The the client and server run on port `5000` and `5001` respectively by default.
Also, the server `docker-compose.yml` creates an [Adminer](https://www.adminer.org/) service on port `5003` for database management.
To access it enter the url, select _Posgres_ in the dropdown menu, use `db` as the host (the name of the database service in the docker network), fill in the user and password of the database and click enter.
You can comment the service entry in the `docker-compose.yml` without consequences.

Note that both client and server run in development mode by default on purpose.

To use different ports, check the [Changing the ports section](#changing-the-ports)

### Docker

You need to have docker and docker-compose installed.

1. Clone the repository.
2. Create a `.env` from the `.env.sample`.
   You can simply run
   ```shell
   cp .env.sample .env
   ```
3. Start the services by running
   ```shell
   make start
   ```
4. Migrate and seed the database
   ```shell
   make migrate
   make seed
   ```

The client will start on port `5000`.
To use different ports, check the [Changing the ports section](#changing-the-ports).
To clean up afterwards, read the [How to clean up after testing?](#how-to-clean-up-after-testing?).

### Manual

You need node `16.x` and postgres `13.x` running.

1. Clone the repository.
2. Go into the `server` directory.
3. Create a `.env` from the `.env.sample`.
   You can simply run
   ```shell
   cp .env.sample .env
   ```
4. Install the back-end dependencies
   ```
   npm i
   ```
5. Migrate and seed the database
   ```
   npm run db migrate:up
   npm run db seed:up
   ```
6. Start the back-end by running
   ```
   npm run dev
   ```
7. Go into the `client` directory.
8. Create a `.env.local` from the `.env.development`.
   You can simply run
   ```shell
   cp .env.development .env.local
   ```
9. Install the back-end dependencies
   ```
   npm i
   ```
10. Start the back-end by running
   ```
   npm run start
   ```

### Changing the ports

In the `.env` file created on step 1. of the [Docker](###docker) section, there are variables to change the ports used by the project:

- `CLIENT_PORT` for the client.
- `SERVER_PORT` for the server.
- `DB_PORT` for the db.
- `ADMINER_PORT` for adminer.

## How to clean up after testing?

### Docker

You can stop the containers running `make stop`.
Note that the containers and volumes will remain in your system.
To remove the images and volumes, use `make clean`.

Afterwards, you can just delete the folder with the repository.

Note that, to remove the build cache from the containers used by this project and other projects you can to run **(at your own risk)** `docker builder prune`.
If you want to go overkill, you could also run **(again, at your own risk)** `docker system prune --volumes` to remove:

- all stopped containers (from this and other projects)
- all networks not used by at least one container (from this and other projects)
- all volumes not used by at least one container (from this and other projects)
- all dangling images (from this and other projects)
- all dangling build cache (from this and other projects)
