package memory

import (
	"sync"
	"time"

	"github.com/caoyongzheng/gotest/token"
)

var lock sync.RWMutex

type Manager struct {
	stores map[string]token.Store
	config *Config
}

type Config struct {
	TokenLength int
	TokenLife   int64
	GCLife      int64
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
	return &Manager{stores: make(map[string]token.Store), config: c}
}

// New 新建一个TokenStore
func (m *Manager) New() token.Store {
	t, _ := token.GenerateToken(m.config.TokenLength)
	s := &Store{
		token:  t,
		expire: time.Now().Add(time.Duration(m.config.TokenLife) * time.Second),
		items:  make(map[string]interface{}),
	}
	lock.Lock()
	defer lock.Unlock()
	m.stores[t] = s
	return s
}

func (m *Manager) Get(t string) token.Store {
	if s, ok := m.stores[t]; ok {
		if time.Now().After(s.GetExpire()) {
			m.Del(t)
			return nil
		}
		return s
	}
	return nil
}

func (m *Manager) Del(t string) {
	lock.Lock()
	defer lock.Unlock()
	delete(m.stores, t)
}

func (m *Manager) GC() {
	lock.RLock()
	defer lock.RUnlock()
	for t, _ := range m.stores {
		m.Get(t)
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
}

func (s *Store) GetToken() string {
	lock.Lock()
	defer lock.Unlock()
	return s.token
}

func (s *Store) GetExpire() time.Time {
	lock.Lock()
	defer lock.Unlock()
	return s.expire
}

func (s *Store) GetItem(key string) (v interface{}) {
	lock.Lock()
	defer lock.Unlock()
	return s.items[key]
}

func (s *Store) SetItem(key string, value interface{}) {
	lock.Lock()
	defer lock.Unlock()
	s.items[key] = value
}

func (s *Store) DelItem(key string) {
	lock.Lock()
	defer lock.Unlock()
	delete(s.items, key)
}
