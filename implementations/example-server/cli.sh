#!/bin/bash

# Function to send a POST request to the example server
send_request() {
    local input_file=$1
    local config=$2
    local output_file=$3

    # Read the input file
    credential=$(cat "$input_file")

    # Construct the JSON payload
    payload=$(jq -n \
                  --argjson cred "$credential" \
                  --argjson conf "$config" \
                  '{credential: $cred, config: $conf}')

    # Send the POST request to localhost (the same container)
    response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$payload" \
        http://localhost:8080/validate)

    # Write the response to the output file
    echo "$response" > "$output_file"

    echo "Response written to $output_file"
}

# Check if required arguments are provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <input_file> <config> <output_file>"
    exit 1
fi

input_file=$1
config=$2
output_file=$3

# Start the web server in the background
./mock-web-server &

# Wait for the server to start
sleep 2

# Call the function to send the request
send_request "$input_file" "$config" "$output_file"

# Display the result
result=$(jq -r .result "$output_file")
echo "Validation result: $result"

# Stop the web server
kill %1