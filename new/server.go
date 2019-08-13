package main

import (
    "fmt"
    "log"
    "io/ioutil"
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
    r.Header.Add("Content-Type", w.FormDataContentType())
    w.Header().Set("Access-Control-Allow-Origin", "*")
    fmt.Println(fmt.Sprintf("%s", r.Body))
    fmt.Println("File Upload Endpoint Hit")

    // Parse our multipart form, 10 << 20 specifies a maximum
    // upload of 10 MB files.
    r.ParseMultipartForm(10 << 20)
    // FormFile returns the first file for the given key `myFile`
    // it also returns the FileHeader so we can get the Filename,
    // the Header and the size of the file
    file, handler, err := r.FormFile("myFile")
    if err != nil {
        fmt.Println("Error Retrieving the File")
        fmt.Println(err)
        return
    }
    defer file.Close()
    fmt.Printf("Uploaded File: %+v\n", handler.Filename)
    fmt.Printf("MIME Header: %+v\n", handler.Header)

    // Create a temporary file within our temp-auth directory that follows
    // a particular naming pattern
    tempFile, err := ioutil.TempFile("temp-auth", ".json")
    if err != nil {
        fmt.Println(err)
    }
    defer tempFile.Close()

    // read all of the contents of our uploaded file into a
    // byte array
    fileBytes, err := ioutil.ReadAll(file)
    if err != nil {
        fmt.Println(err)
    }
    // write this byte array to our temporary file
    tempFile.Write(fileBytes)
    // return that we have successfully uploaded our file!
    fmt.Fprintf(w, "Successfully Uploaded File\n")
}

func router() {
    http.Handle("/", http.FileServer(http.Dir("./js/build")))
    // http.Handle("/web", http.StripPrefix("/web", http.FileServer(http.Dir("./js/build"))))

    http.HandleFunc("/increment", incrementCounter)

    http.HandleFunc("/bash", execBash)

    // http.HandleFunc("/api/auth", func(w http.ResponseWriter, r *http.Request) {
    //     fmt.Fprintf(w, "API")
    // })

    http.HandleFunc("/api/auth", handleAuth)

    http.HandleFunc("*", redirectToFront)
}

func main() {
    // Init router
    router()

    // Start web server on $PORT
    portStr := fmt.Sprintf("%s%d", ":", PORT)
    log.Printf("Serving on HTTP port: %d\n", PORT)
    log.Fatal(http.ListenAndServe(portStr, nil))
}