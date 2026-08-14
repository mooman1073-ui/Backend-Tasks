/*
Part 1: Node Internals

1. What is the Node.js Event Loop?

The Event Loop helps Node.js handle asynchronous operations without stopping
the main thread. When a slow operation starts, Node.js can continue running
other code. After the operation finishes, its callback waits in a queue. The
Event Loop runs the callback when the Call Stack is empty.


2. What is Libuv and what role does it play in Node.js?

Libuv is a library used inside Node.js. It provides the Event Loop and a Thread
Pool. It helps Node.js handle file operations, network operations, timers, DNS,
compression, and other asynchronous tasks.


3. How does Node.js handle asynchronous operations under the hood?

Node.js gives asynchronous work to Libuv or the operating system. Some tasks
use Libuv's Thread Pool. The main JavaScript thread continues running other
code. When the operation finishes, its callback waits in a queue. The Event
Loop runs the callback when the Call Stack is empty.


4. What is the difference between the Call Stack, Event Queue, and Event Loop?

The Call Stack contains the JavaScript code that is running now. The Event
Queue contains callbacks that are ready but waiting to run. The Event Loop
checks the Call Stack. When it is empty, the Event Loop allows a waiting
callback to run.


5. What is the Node.js Thread Pool and how do we set its size?

The Thread Pool is a group of worker threads used by Libuv. It helps Node.js do
some slow tasks without stopping the main JavaScript thread. It is used for
some file, DNS, compression, and encryption operations.

The default size is 4 threads. We can change it before starting the program by
setting UV_THREADPOOL_SIZE.

Example:
UV_THREADPOOL_SIZE=8 node server.js


6. How does Node.js handle blocking and non-blocking code execution?

Blocking code stops Node.js from running other JavaScript until the task is
finished. For example, readFileSync() waits until the complete file is read.

Non-blocking code starts the task and lets Node.js continue running other code.
When the task finishes, its callback runs later. For example, readFile() is
non-blocking. Non-blocking code is better for servers because other requests
do not need to wait for one slow operation.
*/
