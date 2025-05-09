package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/ronymmoura/hey-listen/internal/db"
	"github.com/ronymmoura/hey-listen/internal/db/repositories"
	"github.com/ronymmoura/hey-listen/internal/models"
	"github.com/ronymmoura/hey-listen/internal/util"
)

var conn *db.DB

func main() {

	config := util.LoadConfig(".env")

	conn = db.Connect(config.DatabaseUrl)

	fs := http.FileServer(http.Dir("./client/dist"))
	http.Handle("/", fs)
	http.HandleFunc("/musics", listMusics)
	http.HandleFunc("/musics/new", createMusic)

	http.ListenAndServe(":8081", nil)
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func createMusic(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	body, err := io.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, fmt.Sprintf("could not read body: %v", err))
		return
	}

	var req *models.Music
	if err := json.Unmarshal(body, &req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, fmt.Sprintf("could not parse body: %v", err))
		return
	}

	music, err := repositories.NewMusicRepository(conn).Insert(req)
	musicRes, err := json.Marshal(&music)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, fmt.Sprintf("error: %v", err))
		return
	}

	w.WriteHeader(http.StatusCreated)
	io.WriteString(w, string(musicRes))
}

func listMusics(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	hasYtId := r.URL.Query().Has("yt_id")
	musicsRes := []*models.Music{}

	musicRep := repositories.NewMusicRepository(conn)

	if hasYtId {
		music, err := musicRep.GetByYtID(r.URL.Query().Get("yt_id"))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			io.WriteString(w, fmt.Sprintf("could not retrieve music: %v", err))
			return
		}

		musicsRes = append(musicsRes, music)
	} else {

		musics, err := musicRep.SelectAll()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			io.WriteString(w, fmt.Sprintf("could not retrieve musics list: %v", err))
			return
		}

		musicsRes = musics
	}

	musicsResJson, err := json.Marshal(&musicsRes)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, fmt.Sprintf("could not retrieve musics list: %v", err))
		return
	}

	io.WriteString(w, string(musicsResJson))
}
