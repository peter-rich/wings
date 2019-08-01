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
var port int = 8081

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
		http.Handle("/", http.FileServer(http.Dir("./static/html")))

    http.HandleFunc("/increment", incrementCounter)

    http.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "API")
    })

		portStr := fmt.Sprintf("%s%d", ":", port)
    log.Fatal(http.ListenAndServe(portStr, nil))

}