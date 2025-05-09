package repositories

import (
	"os"
	"testing"

	"github.com/ronymmoura/hey-listen/internal/db"
	"github.com/ronymmoura/hey-listen/internal/util"
)

var testDB *db.DB

func TestMain(m *testing.M) {
	config := util.LoadConfig("../../../.env.test")
	dbConn := db.Connect(config.DatabaseUrl)

	testDB = dbConn

	os.Exit(m.Run())
}
