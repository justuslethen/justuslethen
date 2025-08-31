package config

func LoadAllConfigs() {
	loadAuthConfig()
	loadDBConfig()
	loadMailerConfig()
	loadServerConfig()
}