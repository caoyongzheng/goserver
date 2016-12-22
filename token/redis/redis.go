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

// Manager token管理器
type Manager struct {
	pool   *redis.Pool
	config *Config
}

// Config 配置对象
type Config struct {
	TokenLength int
	TokenLife   int64
	GCLife      int64
	Addr        string
}

// NewManager 创建一个Manager实例
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

// New 创建一个Token实例
func (m *Manager) New() token.Store {
	c := m.pool.Get()
	defer c.Close()
	t, _ := token.GenerateToken(m.config.TokenLength)
	s := Store{
		Token: t,
		Items: make(map[string]interface{}),
		m:     m,
	}
	value, _ := json.Marshal(s)
	_, err := c.Do("SET", "token_"+s.Token, value, "EX", m.config.GCLife)
	if err != nil {
		log.Fatal(err)
		return nil
	}
	return &s
}

// Get 根据Token获取Store
func (m *Manager) Get(token string) token.Store {
	if token == "" {
		return nil
	}
	c := m.pool.Get()
	defer c.Close()
	v, err := redis.Bytes(c.Do("GET", "token_"+token))
	if err != nil {
		return nil
	}
	s := &Store{}
	err = json.Unmarshal(v, s)
	if err != nil {
		return nil
	}
	c.Do("EXPIRE", "token_"+token, m.config.TokenLife)
	s.m = m
	return s
}

// Del 删除Token
func (m *Manager) Del(token string) {
	c := m.pool.Get()
	defer c.Close()
	c.Send("DEL", "token_"+token)
}

// Store TokenStore结构
type Store struct {
	Token string                 `json:"token"`
	Items map[string]interface{} `json:"items"`
	m     *Manager
}

// GetToken 获取Token
func (s *Store) GetToken() string {
	return s.Token
}

//GetExpire 获取过期时间
func (s *Store) GetExpire() time.Time {
	c := s.m.pool.Get()
	defer c.Close()
	seconds, _ := redis.Int64(c.Do("TTL", "token_"+s.Token))
	if seconds == -1 {
		return time.Time{}
	}
	return time.Now().Add(time.Duration(seconds) * time.Second)
}

// SetExpire 重新设置过期时间
func (s *Store) SetExpire(t time.Time) {
	d := t.Sub(time.Now())
	if d > 0 {
		c := s.m.pool.Get()
		defer c.Close()
		c.Do("EXPIRE", "token_"+s.Token, d)
	}
}

// GetItem 获取键值
func (s *Store) GetItem(key string) (v interface{}) {
	lock.Lock()
	defer lock.Unlock()
	return s.Items[key]
}

// SetItem 设置键值
func (s *Store) SetItem(key string, value interface{}) {
	lock.Lock()
	defer lock.Unlock()
	s.Items[key] = value
	log.Print(s.m)
	c := s.m.pool.Get()
	defer c.Close()
	v, _ := json.Marshal(s)
	c.Do("SET", "token_"+s.Token, v, "EX", s.m.config.TokenLife)
}

// DelItem 删除键值
func (s *Store) DelItem(key string) {
	lock.Lock()
	defer lock.Unlock()
	delete(s.Items, key)
	c := s.m.pool.Get()
	defer c.Close()
	value, _ := json.Marshal(s)
	c.Do("SET", "token_"+s.Token, value, "EX", s.m.config.TokenLife)
}
