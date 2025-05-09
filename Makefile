include .env

MAKEFILE_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
DB_URL := postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?sslmode=disable

dev: 
	docker-compose up -d app-dev

reset-db: drop-db setup seed

setup: create-db migrate-up

test:
	docker exec -it hey-listen-app-dev-1 go test ./...

test-coverage: |
	docker exec -it hey-listen-app-dev-1 go test -cover -coverprofile=c.out ./...
	docker exec -it hey-listen-app-dev-1 go tool cover -html=c.out -o coverage.html

bench:
	 go test -bench . renovy/hey-listen/internal/lib/util

server:
	go run ./main.go

seed:
	docker exec -it hey-listen-app-1 go run ./cmd/seed/seed.go

# DB
create-db:
	docker exec -it hey-listen-postgres-1 createdb --username=${DATABASE_USER} --owner=${DATABASE_USER} ${DATABASE_NAME}

drop-db:
	docker exec -it postgres dropdb ${DATABASE_NAME}

migration-new:
	docker run --rm -v $(MAKEFILE_DIR):/src -w /src --network host migrate/migrate create -ext sql -dir=internal/db/migrations -seq $(name)

migrate-up:
	docker run --rm -v $(MAKEFILE_DIR):/src -w /src --network hey-listen_heylistennet migrate/migrate -path=internal/db/migrations/ -database="$(DB_URL)" up

migrate-up1:
	docker run --rm -v $(MAKEFILE_DIR):/src -w /src --network host migrate/migrate -path=internal/db/migrations/ -database="$(DB_URL)" up 1
	
migrate-down:
	docker run --rm -v $(MAKEFILE_DIR):/src -w /src --network host migrate/migrate -path=internal/db/migrations/ -database="$(DB_URL)" down -all
	
migrate-down1:
	docker run --rm -v $(MAKEFILE_DIR):/src -w /src --network host migrate/migrate -path=internal/db/migrations/ -database="$(DB_URL)" down 1

# TOOLS
ngrok:
	ngrok http http://localhost:8080

.PHONY:
	reset-db create-db drop-db migration-new migrate-up migrate-down migrate-up1 migrate-down1 
	ngrok
