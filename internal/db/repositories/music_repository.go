package repositories

import (
	"encoding/json"

	"github.com/ronymmoura/hey-listen/internal/db"
	"github.com/ronymmoura/hey-listen/internal/models"
)

type MusicRepository struct {
	DB *db.DB
}

func NewMusicRepository(db *db.DB) *MusicRepository {
	return &MusicRepository{
		DB: db,
	}
}

// -----------------------------
// Insert
// -----------------------------
const insertQuery = `
	INSERT INTO musics
	(
		title,
		artist,
		yt_id,
		lyrics
	)
	VALUES (
		:title,
		:artist,
		:yt_id,
		:lyrics
	) RETURNING *`

func (r *MusicRepository) Insert(args *models.Music) (*models.Music, error) {
	lyricsJson, err := json.Marshal(args.Lyrics)
	if err != nil {
		return nil, err
	}

	args.LyricsStr = string(lyricsJson)

	rows, err := r.DB.Conn.NamedQuery(insertQuery, args)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	music := &models.Music{}
	for rows.Next() {
		err := rows.StructScan(&music)
		if err != nil {
			return nil, err
		}
	}

	return music, nil
}

// ----------------------
// List
// ----------------------
const selectAllQuery = `SELECT * FROM musics`

func (r *MusicRepository) SelectAll() ([]*models.Music, error) {
	musics := []*models.Music{}
	if err := r.DB.Conn.Select(&musics, selectAllQuery); err != nil {
		return nil, err
	}

	return musics, nil
}

// ----------------------
// Get by yt_id
// ----------------------
const getByYtIDQuery = `SELECT * FROM musics WHERE yt_id = $1`

func (r *MusicRepository) GetByYtID(ytID string) (*models.Music, error) {
	music := &models.Music{}
	if err := r.DB.Conn.Get(music, getByYtIDQuery, ytID); err != nil {
		return nil, err
	}

	music.ParseLyrics()

	return music, nil
}
