.PHONY: start migrate seed stop clean

start:
	docker-compose up -d

migrate:
	docker-compose up -d
	docker-compose exec -- server npm run db migrate:up

seed:
	docker-compose up -d
	docker-compose exec -- server npm run db seed:run

stop:
	docker-compose down

clean:
	docker-compose down --rmi all -v