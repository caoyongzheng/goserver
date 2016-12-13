package memory

import (
	"sync"
	"time"

	"github.com/caoyongzheng/gotest/token"
)

type Manager struct {
	stores map[string]token.Store
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
	return &Manager{stores: make(map[string]token.Store), config: c}
}

// New 新建一个TokenStore
func (m *Manager) New() (token.Store, error) {
	t, _ := token.GenerateToken(m.config.TokenLength)
	s := &Store{
		token:  t,
		expire: time.Now().Add(time.Duration(m.config.TokenLife) * time.Second),
		items:  make(map[string]interface{}),
	}
	m.lock.Lock()
	defer m.lock.Unlock()
	m.stores[t] = s
	return s, nil
}

func (m *Manager) Get(t string) token.Store {
	m.lock.RLock()
	defer m.lock.RUnlock()
	return m.stores[t]
}

func (m *Manager) Del(t string) {
	m.lock.Lock()
	defer m.lock.Unlock()
	delete(m.stores, t)
}

func (m *Manager) GC() {
	m.lock.RLock()
	defer m.lock.RUnlock()
	for t, s := range m.stores {
		if s.IsExpire() {
			delete(m.stores, t)
		}
	}
}

func (m *Manager) GCLoop() {
	m.GC()
	time.AfterFunc(time.Duration(m.config.GCLife)*time.Second, m.GCLoop)
}

type Store struct {
	token  string
	expire time.Time
	items  map[string]interface{}
	lock   sync.RWMutex
}

func (s *Store) GetToken() string {
	s.lock.Lock()
	defer s.lock.Unlock()
	return s.token
}

func (s *Store) GetExpire() time.Time {
	s.lock.Lock()
	defer s.lock.Unlock()
	return s.expire
}

// IsExpired Token是否过期
func (s *Store) IsExpire() bool {
	s.lock.Lock()
	defer s.lock.Unlock()
	return time.Now().After(s.expire)
}

func (s *Store) GetItem(key string) (v interface{}) {
	s.lock.Lock()
	defer s.lock.Unlock()
	return s.items[key]
}

func (s *Store) SetItem(key string, value interface{}) {
	s.lock.Lock()
	defer s.lock.Unlock()
	s.items[key] = value
}

func (s *Store) DelItem(key string) {
	s.lock.Lock()
	defer s.lock.Unlock()
	delete(s.items, key)
}
