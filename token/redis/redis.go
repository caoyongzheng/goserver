package tokenRedis

import (
	"sync"

	"github.com/caoyongzheng/gotest/token"
)

type Manager struct {
	config Config
	lock   sync.RWMutex
}

type Config struct {
	TokenLength int
	TokenLife   int64
	GCLife      int64
}

func NewManager(c Config) token.Manager {
	if c.TokenLength < 16 {
		c.TokenLength = 16
	}
	if c.TokenLife == 0 {
		c.TokenLife = 3600
	}
	if c.GCLife == 0 {
		c.GCLife = 3600
	}
	return &Manager{config: c}
}

func (m *Manager) New() token.Store {
	return nil
}

func (m *Manager) Get(token string) token.Store {
	return nil
}

func (m *Manager) Del(token string) {
}

func (m *Manager) GC() {
}

func (m *Manager) GCLoop() {
}

//
// // New 新建一个Token
// func (s *RedisStore) New() (t token.Token) {
// 	id, _ := token.Guid(s.config.TokenLength)
// 	t = &RedisToken{
// 		Id:     id,
// 		Expire: time.Now().Add(time.Duration(s.config.TokenLife) * time.Second),
// 		Items:  make(map[string]interface{}),
// 	}
// 	s.lock.Lock()
// 	defer s.lock.Unlock()
// 	s.tokens[id] = t
// 	return
// }
//
// func (s *RedisStore) Get(tokenId string) token.Token {
// 	s.lock.RLock()
// 	defer s.lock.RUnlock()
// 	return s.tokens[tokenId]
// }
//
// func (s *RedisStore) Del(tokenId string) {
// 	s.lock.Lock()
// 	defer s.lock.Unlock()
// 	delete(s.tokens, tokenId)
// }
//
// func (s *RedisStore) GC() {
// 	s.lock.RLock()
// 	defer s.lock.RUnlock()
// 	for k, t := range s.tokens {
// 		if t.IsExpire() {
// 			delete(s.tokens, k)
// 		}
// 	}
// }
//
// func (s *RedisStore) GCLoop() {
// 	s.GC()
// 	time.AfterFunc(time.Duration(s.config.GCLife)*time.Second, s.GCLoop)
// }
//
// type RedisToken struct {
// 	Id     string
// 	Expire time.Time
// 	Items  map[string]interface{}
// 	lock   sync.RWMutex
// }
//
// func (t *RedisToken) GetId() string {
// 	t.lock.Lock()
// 	defer t.lock.Unlock()
// 	return t.Id
// }
//
// func (t *RedisToken) GetExpire() time.Time {
// 	t.lock.Lock()
// 	defer t.lock.Unlock()
// 	return t.Expire
// }
//
// // IsExpired Token是否过期
// func (t *RedisToken) IsExpire() bool {
// 	t.lock.Lock()
// 	defer t.lock.Unlock()
// 	return time.Now().After(t.Expire)
// }
//
// func (t *RedisToken) GetItem(key string) (v interface{}) {
// 	t.lock.Lock()
// 	defer t.lock.Unlock()
// 	return t.Items[key]
// }
//
// func (t *RedisToken) SetItem(key string, value interface{}) {
// 	t.lock.Lock()
// 	defer t.lock.Unlock()
// 	t.Items[key] = value
// }
//
// func (t *RedisToken) DelItem(key string) {
// 	t.lock.Lock()
// 	defer t.lock.Unlock()
// 	delete(t.Items, key)
// }
