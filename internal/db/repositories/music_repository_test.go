package repositories

import (
	"math/rand"
	"strconv"
	"testing"

	"github.com/ronymmoura/hey-listen/internal/models"
	"github.com/stretchr/testify/require"
)

func createRandomMusic(t *testing.T) *models.Music {
	args := &models.Music{
		Title:  "Test Title",
		Artist: "Test Artist",
		YtID:   strconv.Itoa(rand.Intn(9999 - 1000 + 1)),
		Lyrics: map[string]string{"0": "Test Lyrics"},
	}

	music, err := NewMusicRepository(testDB).Insert(args)
	require.NoError(t, err)
	require.NotEmpty(t, music)
	require.Equal(t, args.Title, music.Title)

	return music
}

func TestCreateMusic(t *testing.T) {
	_ = createRandomMusic(t)
}

func TestListMusics(t *testing.T) {
	musics, err := NewMusicRepository(testDB).SelectAll()
	require.NoError(t, err)
	require.NotEmpty(t, musics)
}

func TestGetMusic(t *testing.T) {
	createdMusic := createRandomMusic(t)

	music, err := NewMusicRepository(testDB).GetByYtID(createdMusic.YtID)
	require.NoError(t, err)
	require.NotEmpty(t, music)
	require.Equal(t, createdMusic.Title, music.Title)
}
