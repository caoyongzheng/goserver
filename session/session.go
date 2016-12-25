package session

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"time"
)

// Provider Session
type Provider interface {
	New() (string, error)
	IsExist(token string) bool
	Del(token string) error
	GetExpire(token string) time.Time
	SetExpire(token string, t time.Time) error
	GetItems(token string) map[string]string
	GetItem(token, key string) string
	SetItem(token, key, value string) error
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
