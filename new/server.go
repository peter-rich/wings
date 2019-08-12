package main

import (
    "fmt"
    "log"
    "net/http"
    "strconv"
    "sync"
    "os/exec"
    "math/rand"
)
const maxUploadSize = 5 * 1024 // 5 MB
var counter int
var mutex = &sync.Mutex{}
var PORT int = 8081

func sayHello(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "hello")
}

func execBash(w http.ResponseWriter, r *http.Request) {
    cmd := exec.Command("ls", "-lah")
    out, err := cmd.CombinedOutput()
	if err != nil {
		log.Fatalf("cmd.Run() failed with %s\n", err)
    }
    fmt.Fprintf(w, fmt.Sprintf("combined out: \n%s\n", string(out)))
}

func incrementCounter(w http.ResponseWriter, r *http.Request) {
    mutex.Lock()
    rand.Int()
    counter++
    fmt.Fprintf(w, strconv.Itoa(counter))
    mutex.Unlock()
}

func redirectToFront(w http.ResponseWriter, r *http.Request) {
    http.Redirect(w, r, "/", 301)
}

func handleAuth(w http.ResponseWriter, r *http.Request) {
    log.Printf("%s", fmt.Sprintf("%s", r))
    fmt.Fprintf(w, fmt.Sprintf("%s", r.Body))
    // return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    //     r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)
    //     if err := r.ParseMultipartForm(maxUploadSize); err != nil {
    //         renderError(w, "FILE_TOO_BIG", http.StatusBadRequest)
    //         return
    //     }

    //     fileType := r.PostFormValue("type")
    //     file, _, err := r.FormFile("uploadFile")
    //     if err != nil {
    //         renderError(w, "INVALID_FILE", http.StatusBadRequest)
    //         return
    //     }
    //     defer file.Close()
    //     fileBytes, err := ioutil.ReadAll(file)
    //     if err != nil {
    //         renderError(w, "INVALID_FILE", http.StatusBadRequest)
    //         return
    //     }

    //     filetype := http.DetectContentType(fileBytes)
    //     if filetype != "json" {
    //         renderError(w, "INVALID_FILE_TYPE", http.StatusBadRequest)
    //         return
    //     }

    //     fileName := randToken(12)
    //     fileEndings, err := mime.ExtensionsByType(fileType)
    //     if err != nil {
    //         renderError(w, "CANT_READ_FILE_TYPE", http.StatusInternalServerError)
    //         return
    //     }
    //     newPath := filepath.Join(uploadPath, fileName+fileEndings[0])
    //     fmt.Printf("FileType: %s, File: %s\n", fileType, newPath)

    //     newFile, err := os.Create(newPath)
    //     if err != nil {
    //         renderError(w, "CANT_WRITE_FILE", http.StatusInternalServerError)
    //         return
    //     }
    //     defer newFile.Close()
    //     if _, err := newFile.Write(fileBytes); err != nil {
    //         renderError(w, "CANT_WRITE_FILE", http.StatusInternalServerError)
    //         return
    //     }
    //     w.Write([]byte("SUCCESS"))
    // }
}

func main() {

    http.Handle("/", http.FileServer(http.Dir("./js/build")))
    // http.Handle("/web", http.StripPrefix("/web", http.FileServer(http.Dir("./js/build"))))

    http.HandleFunc("/increment", incrementCounter)

    http.HandleFunc("/bash", execBash)

    // http.HandleFunc("/api/auth", func(w http.ResponseWriter, r *http.Request) {
    //     fmt.Fprintf(w, "API")
    // })

    http.HandleFunc("/api/auth", handleAuth)

    http.HandleFunc("*", redirectToFront)
    // Start web server on $PORT
    portStr := fmt.Sprintf("%s%d", ":", PORT)
    log.Printf("Serving on HTTP port: %d\n", PORT)
    log.Fatal(http.ListenAndServe(portStr, nil))
}