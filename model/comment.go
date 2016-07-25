package model

import (
	"time"
)

//Comment 评论
type Comment struct {
	ID      string    `bson:"_id" json:"id" form:"id"`
	Reply   string    `bson:"reply" json:"reply" form:"reply"`
	UserID  string    `bson:"userId" json:"userId" form:"userId"`
	Content string    `bson:"content" json:"content" form:"content"`
	Date    time.Time `bson:"date" json:"date" form:"date"`
}
