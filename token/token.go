package token

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"time"
)

type Manager interface {
	New() (s Store, err error)
	Get(token string) Store
	Del(token string)
	GC()
	GCLoop()
}

type Store interface {
	GetToken() string
	GetExpire() time.Time
	IsExpire() bool
	GetItem(key string) interface{}
	SetItem(key string, value interface{})
	DelItem(key string)
}

func GenerateToken(l int) (string, error) {
	if l < 16 {
		l = 16
	}
	b := make([]byte, l)
	n, err := rand.Read(b)
	if n != len(b) || err != nil {
		return "", fmt.Errorf("Could not successfully read from the system CSPRNG.")
	}
	return hex.EncodeToString(b), nil
}
