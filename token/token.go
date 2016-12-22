package token

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"time"
)

// Manager TokenManager
type Manager interface {
	New() Store
	Get(token string) Store
	Del(token string)
}

// Store Token Store
type Store interface {
	GetToken() string
	GetExpire() time.Time
	SetExpire(t time.Time)
	GetItem(key string) interface{}
	SetItem(key string, value interface{})
	DelItem(key string)
}

// GenerateToken 产生一个唯一值
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
