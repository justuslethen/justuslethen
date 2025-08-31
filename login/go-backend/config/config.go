package config

func LoadAllConfigs() error {
	err := loadAuthConfig()
	if err != nil {
		return err
	}
	
	err = loadDBConfig()
	if err != nil {
		return err
	}

	err = loadMailerConfig()
	if err != nil {
		return err
	}

	err = loadServerConfig()
	if err != nil {
		return err
	}
}
