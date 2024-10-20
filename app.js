const http = require('http');
const { readFile, writeFile } = require('fs');
const PORT = 5000;
const HOSTNAME = 'localhost';

// create a server
const server = http.createServer((req, res) => {
    // Set Content-Type to application/json
    res.setHeader('Content-Type', 'application/json');

    if (req.url === "/tasks" && req.method === "GET") {
        // Read tasks from data.json
        readFile('./data.json', 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({
                    message: err?.message || 'Something went wrong while reading the file.'
                }));
                return;
            }
            res.writeHead(200);
            res.end(data); // Send the JSON data
        });
    } else if (req.url === "/tasks" && req.method === "POST") {
        let reqData = '';

        // Collect incoming data
        req.on('data', (chunk) => {
            reqData += chunk.toString();
        }); 

        // Handle the end of the request
        req.on('end', () => {
            // Parse the existing tasks
            readFile('./data.json', 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: err?.message || 'Error while reading the file.'
                    }));
                    return;
                }

                // Update the tasks array
                let tasks = JSON.parse(data);
                tasks.push(JSON.parse(reqData));

                // Write updated tasks back to data.json
                writeFile('./data.json', JSON.stringify(tasks), (writeErr) => {
                    if (writeErr) {
                        res.writeHead(500);
                        res.end(JSON.stringify({
                            message: writeErr?.message || 'Error while writing to the file.'
                        }));
                        return;
                    }

                    res.writeHead(201);
                    res.end(JSON.stringify({
                        message: 'Task added successfully!'
                    }));
                });
            });
        });

        req.on('error', (err) => {
            res.writeHead(400);
            res.end(JSON.stringify({
                message: err?.message || 'Error occurred during request processing.'
            }));
        });
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({
            message: 'Route not found.'
        }));
    }
});

// Listen on port
server.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
