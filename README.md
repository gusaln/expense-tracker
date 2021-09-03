# Where is my money? - Expense tracker

This is app is a test design of and expense tracker.
It serves as a design exercise and development exercise in the tools the programs is written.
It is presented as a web-app.
The back-end is written in [Express v4](http://expressjs.com/) and the front-end in [React](https://reactjs.org/).

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

The server runs on port `5000` and the client on port `3000` by default.
Also, the server `docker-compose.yml` creates an [Adminer](https://www.adminer.org/) service on port `8888` for database management.
To access it enter the url, select Posgres in the dropdown menu, use `db` as the host (the name of the database service in the docker network), fill in the user and password of the database and click enter.
You can comment the sercive entry in the `docker-compose.yml` without consequences.

To use different ports, check the [Changing the ports section](#changing-the-ports)

### Manual

You need node `16.x` and postgres `13.x`.

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

### Docker

You need to have docker and docker-compose installed.

You can change the ports of the server

1. Clone the repository.
2. Go into the `server` directory.
3. Create a `.env` from the `.env.sample`.
   You can simply run
   ```shell
   cp .env.sample .env
   ```
   Change the variable `DATABASE_HOST` form `localhost` to `db`
4. Start the back-end by running
   ```shell
   make start
   make migrate
   make seed
   ```
5. Go into the `client` directory.
6. Create a `.env.local` from the `.env.development`.
   You can simply run
   ```shell
   cp .env.development .env.local
   ```
7. Start the front end by running
   ```
   make start
   ```

### Hybrid

Run the server using docker and the client manually.

### Changing the ports

Perform the following steps if you wish to use different ports:

1. **Before** starting the back-end, change the target port (the one on the left) of the `server` service in the `server/docker-compose.yml` file.
2. **Before** starting the front-end, Go to `client/.env.local` and update the `REACT_APP_BASE_URL` variable.
   Change the port to the one you assign in the docker compose file.

## How to clean up after testing?

### Docker

You can stop the containers by going into each directory and running `make stop`.
Note that the containers and volumes will remain in your system.
To remove the images, use `make clean`.

As a note, remember that you can run `docker system prune --volumes` to remove:

- all stopped containers
- all networks not used by at least one container
- all volumes not used by at least one container
- all dangling images
- all dangling build cache

Afterwards, just delete the folder with the repository.