package db

import (
	"log"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type DB struct {
	Conn *sqlx.DB
}

func Connect(databaseUrl string) *DB {
	db, err := sqlx.Connect("postgres", databaseUrl)
	if err != nil {
		log.Fatalf("couldn't connect to database: %v", err)
	}

	return &DB{Conn: db}
}
