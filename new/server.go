package main

import (
    "fmt"
    "log"
    "net/http"
    "strconv"
    "sync"
)

var counter int
var mutex = &sync.Mutex{}
var PORT int = 8081

func sayHello(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "hello")
}

func incrementCounter(w http.ResponseWriter, r *http.Request) {
    mutex.Lock()
    counter++
    fmt.Fprintf(w, strconv.Itoa(counter))
    mutex.Unlock()
}

func main() {

		// http.HandleFunc("/", sayHello)
		http.Handle("/", http.FileServer(http.Dir("./js/build")))

    http.HandleFunc("/increment", incrementCounter)

    http.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "API")
    })

		// Start web server on $PORT
		portStr := fmt.Sprintf("%s%d", ":", PORT)
    log.Fatal(http.ListenAndServe(portStr, nil))

}