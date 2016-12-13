package redis

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/caoyongzheng/gotest/token"
	"github.com/garyburd/redigo/redis"
)

var lock sync.RWMutex

type Manager struct {
	pool   *redis.Pool
	config *Config
}

type Config struct {
	TokenLength int
	TokenLife   int64
	GCLife      int64
	Addr        string
}

func NewManager(c *Config) token.Manager {
	if c.TokenLength < 16 {
		c.TokenLength = 16
	}
	if c.TokenLife == 0 {
		c.TokenLife = 3600
	}
	if c.GCLife == 0 {
		c.GCLife = 3600
	}
	if c.Addr == "" {
		c.Addr = "0.0.0.0:6379"
	}
	return &Manager{
		config: c,
		pool: &redis.Pool{
			MaxIdle:     3,
			IdleTimeout: 240 * time.Second,
			Dial:        func() (redis.Conn, error) { return redis.Dial("tcp", c.Addr) },
		},
	}
}

func (m *Manager) New() (token.Store, error) {
	c := m.pool.Get()
	defer c.Close()
	t, _ := token.GenerateToken(m.config.TokenLength)
	s := Store{
		Token:  t,
		Expire: time.Now().Add(time.Duration(m.config.TokenLife) * time.Second),
		Items:  make(map[string]interface{}),
	}
	value, _ := json.Marshal(s)
	_, err := c.Do("SET", "token_"+s.Token, value)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (m *Manager) Get(token string) token.Store {
	c := m.pool.Get()
	defer c.Close()
	v, err := redis.Bytes(c.Do("GET", "token_"+token))
	if err != nil {
		log.Print(err)
		return nil
	}
	s := &Store{}
	err = json.Unmarshal(v, s)
	if err != nil {
		log.Print(err)
		return nil
	}
	return s
}

func (m *Manager) Del(token string) {
}

func (m *Manager) GC() {
}

func (m *Manager) GCLoop() {
}

type Store struct {
	Token  string                 `json:"token"`
	Expire time.Time              `json:"expire"`
	Items  map[string]interface{} `json:"items"`
}

func (s *Store) GetToken() string {
	lock.Lock()
	defer lock.Unlock()
	return s.Token
}

func (s *Store) GetExpire() time.Time {
	lock.Lock()
	defer lock.Unlock()
	return s.Expire
}

// IsExpired Token是否过期
func (s *Store) IsExpire() bool {
	lock.Lock()
	defer lock.Unlock()
	return time.Now().After(s.Expire)
}

func (s *Store) GetItem(key string) (v interface{}) {
	lock.Lock()
	defer lock.Unlock()
	return s.Items[key]
}

func (s *Store) SetItem(key string, value interface{}) {
	lock.Lock()
	defer lock.Unlock()
	s.Items[key] = value
}

func (s *Store) DelItem(key string) {
	lock.Lock()
	defer lock.Unlock()
	delete(s.Items, key)
}
