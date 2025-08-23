package internal

import (
	"net/http"
	"os"
	"path/filepath"
)

// frontend files are served from /dist directory
func ServeFrontend(w http.ResponseWriter, r *http.Request) {

	// define route to the dist folder
	path := filepath.Join("../login-app/dist", r.URL.Path)

	// check if file exists and is not a directory
	if info, err := os.Stat(path); err == nil && !info.IsDir() {
		// serve the file if exists
		http.ServeFile(w, r, path)
		
		return
	}

	// serve the index file to load the SPA
	http.ServeFile(w, r, filepath.Join("../login-app/dist", "index.html"))
}