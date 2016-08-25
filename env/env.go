package env

func init() {
	initConfig()
	initDB()
	initSessions()
	initRouter()
}
