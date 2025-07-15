FROM golang:1.24.4-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./main.go


FROM gcr.io/distroless/static-debian11

COPY --from=builder /server /server

EXPOSE 8080

CMD ["/server"]