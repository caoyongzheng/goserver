package redis

import "testing"

func TestNewManager(t *testing.T) {
	c := &Config{}
	NewManager(c)
	if c.Addr != "0.0.0.0:6379" {
		t.Errorf("manager.config.Addr expected %s, but is %s", "0.0.0.0", c.Addr)
	}
}

func TestNew(t *testing.T) {
	c := &Config{}
	m := NewManager(c)
	_, err := m.New()
	if err != nil {
		t.Error(err)
	}
}

func TestGet(t *testing.T) {
	m := NewManager(&Config{})
	s, _ := m.New()
	ns := m.Get(s.GetToken())
	if s.GetToken() != ns.GetToken() {
		t.Error("s`s token should be equal to ns")
	}
}

func TestDel(t *testing.T) {
	m := NewManager(&Config{})
	s, _ := m.New()
	s1 := m.Get(s.GetToken())
	if s1 == nil {
		t.Error("s1 expected not nil")
	}
	m.Del(s.GetToken())
	s2 := m.Get(s.GetToken())
	if s2 != nil {
		t.Errorf("s2 show be nil, but %v", s2)
	}
}
