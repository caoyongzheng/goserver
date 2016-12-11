package token

import (
	"fmt"
	"testing"
)

func TestGenerateToken(t *testing.T) {
	id, err := GenerateToken(16)
	if err != nil || len(id) != 32 {
		t.Fatal(err)
	}
	fmt.Println(id)
}
