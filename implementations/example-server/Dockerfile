# Use the official Golang image to create a build artifact.
FROM golang:1.22 as builder

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source from the current directory to the working Directory inside the container
COPY . .

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o example-server .

# Use a Docker multi-stage build to create a lean production image.
FROM alpine:latest

RUN apk --no-cache add ca-certificates curl jq bash

WORKDIR /root/

# Copy the pre-built binary file from the previous stage
COPY --from=builder /app/example-server .

# Copy the test script
COPY cli.sh .

# Make the test script executable
RUN chmod +x cli.sh

# Expose port 8080
EXPOSE 8080

# Command to run the executable
CMD ["./example-server"]
