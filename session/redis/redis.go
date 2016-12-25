package redis

import (
	"encoding/json"
	"time"

	"github.com/caoyongzheng/gotest/session"
	"github.com/garyburd/redigo/redis"
)

// Provider token提供器
type Provider struct {
	pool *redis.Pool
}

// New Provider实例
func New() session.Provider {
	return &Provider{
		pool: &redis.Pool{
			MaxIdle:     3,
			IdleTimeout: 240 * time.Second,
			Dial:        func() (redis.Conn, error) { return redis.Dial("tcp", "0.0.0.0:6379") },
		},
	}
}

// New 新建一个会话实例
func (p *Provider) New() (t string, err error) {
	c := p.pool.Get()
	defer c.Close()
	t, err = session.GenerateToken(16)
	if err != nil {
		return
	}
	_, err = c.Do("SET", "session:"+t, "")
	return
}

// IsExist 会话是否存在
func (p *Provider) IsExist(token string) bool {
	c := p.pool.Get()
	defer c.Close()
	i, _ := redis.Int(c.Do("EXISTS", "session:"+token))
	return i > 0
}

// Del 删除会话
func (p *Provider) Del(t string) (err error) {
	c := p.pool.Get()
	defer c.Close()
	_, err = c.Do("DEL", "session:"+t)
	return
}

// GetExpire 获取过期时间
func (p *Provider) GetExpire(token string) (t time.Time) {
	c := p.pool.Get()
	defer c.Close()
	seconds, err := redis.Int64(c.Do("TTL", "session:"+token))
	if err != nil {
		return
	}
	if seconds == -1 {
		t = time.Time{}
		return
	}
	t = time.Now().Add(time.Duration(seconds) * time.Second)
	return
}

// SetExpire 设置过期时间
func (p *Provider) SetExpire(token string, t time.Time) (err error) {
	d := t.Sub(time.Now())
	if d > 0 {
		c := p.pool.Get()
		defer c.Close()
		_, err = c.Do("EXPIRE", "session:"+token, int(d.Seconds()))
	}
	return
}

// GetItems 获取所有项
func (p *Provider) GetItems(token string) (m map[string]string) {
	c := p.pool.Get()
	defer c.Close()
	b, _ := redis.Bytes(c.Do("GET", "session:"+token))
	m = make(map[string]string, 0)
	json.Unmarshal(b, &m)
	return
}

// GetItem 获取某一项
func (p *Provider) GetItem(token, key string) (s string) {
	s = p.GetItems(token)[key]
	return
}

// SetItem 设置某一项
func (p *Provider) SetItem(token, key, value string) (err error) {
	m := p.GetItems(token)
	m[key] = value
	b, _ := json.Marshal(m)
	c := p.pool.Get()
	defer c.Close()
	seconds, err := redis.Int64(c.Do("TTL", "session:"+token))
	if err != nil {
		return
	}
	if seconds == -1 {
		_, err = c.Do("SET", "session:"+token, b)
	} else {
		_, err = c.Do("SET", "session:"+token, b, "EX", seconds)
	}
	return
}
