
FROM golang:1.24.4-alpine AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -v -o /app/main ./cmd/api

FROM gcr.io/distroless/static-debian11

COPY --from=builder /app/main /

EXPOSE 8080

ENTRYPOINT ["/main"]