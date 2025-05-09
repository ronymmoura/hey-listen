package models

import (
	"encoding/json"
	"time"
)

type Music struct {
	ID        int32  `db:"id"     json:"id"`
	Title     string `db:"title"  json:"title"`
	Artist    string `db:"artist" json:"artist"`
	YtID      string `db:"yt_id"  json:"yt_id"`
	LyricsStr string `db:"lyrics"`

	Lyrics map[string]string `json:"lyrics"`

	CreatedAt *time.Time `db:"created_at" json:"created_at"`
	UpdatedAt *time.Time `db:"updated_at" json:"updated_at"`
}

func (m *Music) ParseLyrics() {
	_ = json.Unmarshal([]byte(m.LyricsStr), &m.Lyrics)
}
