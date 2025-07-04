# PocketBlocks's backend

## How to contribute

### Start dev server

1. Install Go Version 1.22.3 in your machine.
2. Check out source code.
3. Change to server dir in the repository root via `cd server`.
4. Run `go mod tidy` to install dependencies.
5. Run `go run main.go serve` to build and start the server.


## How to build

#### Windows

```bash
GOOS=windows GOARCH=amd64 go build -o pocketblocks.exe main.go
# or
GOOS=windows GOARCH=386 go build -o pocketblocks.exe main.go
```

#### Mac

```bash
GOOS=darwin GOARCH=amd64 go build -o pocketblocks main.go
```

#### ARM

```bash
GOOS=linux GOARCH=arm go build -o pocketblocks main.go
# or
GOOS=linux GOARCH=arm64 go build -o pocketblocks main.go
```