# Dockerfile

FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix nocgo -ldflags "-s -w" -o /app/server ./cmd/server/main.go

FROM alpine:latest

WORKDIR /app

COPY web ./web

COPY --from=builder /app/server ./server

EXPOSE 8080

CMD ["./server"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD wget --quiet --tries=1 --timeout=5 -O /dev/null http://localhost:8080/api/v1/health || exit 1