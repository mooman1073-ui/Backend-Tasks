const fs = require("fs");
const path = require("path");
const os = require("os");
const EventEmitter = require("events");
const zlib = require("zlib");
const { pipeline } = require("stream");

// Question 1
function showCurrentPath() {
    console.log({
        File: __filename,
        Dir: __dirname
    });
}

console.log("Question 1:");
showCurrentPath();

// Question 2
function getFileName(filePath) {
    return path.basename(filePath);
}

console.log("Question 2:", getFileName("/user/files/report.pdf"));

// Question 3
function buildPath(pathObject) {
    return path.format(pathObject);
}

console.log(
    "Question 3:",
    buildPath({ dir: "/folder", name: "app", ext: ".js" })
);

// Question 4
function getFileExtension(filePath) {
    return path.extname(filePath);
}

console.log("Question 4:", getFileExtension("/docs/readme.md"));

// Question 5
function parseFilePath(filePath) {
    const parsedPath = path.parse(filePath);

    return {
        Name: parsedPath.name,
        Ext: parsedPath.ext
    };
}

console.log("Question 5:", parseFilePath("/home/app/main.js"));

// Question 6
function checkAbsolute(filePath) {
    return path.isAbsolute(filePath);
}

console.log("Question 6:", checkAbsolute("/home/user/file.txt"));

// Question 7
function joinSegments(...segments) {
    return path.join(...segments);
}

console.log("Question 7:", joinSegments("src", "components", "App.js"));

// Question 8
function resolvePath(relativePath) {
    return path.resolve(relativePath);
}

console.log("Question 8:", resolvePath("./index.js"));

// Question 9
function joinTwoPaths(firstPath, secondPath) {
    return path.join(firstPath, secondPath);
}

console.log(
    "Question 9:",
    joinTwoPaths("/folder1", "folder2/file.txt")
);

// Question 10
function deleteFile(filePath) {
    fs.unlink(filePath, function (error) {
        if (error) {
            console.log("Question 10 error:", error.message);
            return;
        }

        console.log(`Question 10: ${path.basename(filePath)} is deleted.`);
    });
}

const temporaryFile = path.join(__dirname, "test-files", "file-to-delete.txt");
fs.writeFileSync(temporaryFile, "This file is only used to test deletion.");
deleteFile(temporaryFile);

// Question 11
function createFolder(folderPath) {
    try {
        fs.mkdirSync(folderPath, { recursive: true });
        return "Success";
    } catch (error) {
        return `Could not create the folder: ${error.message}`;
    }
}

const newFolder = path.join(__dirname, "test-files", "new-folder");
console.log("Question 11:", createFolder(newFolder));

// Question 12
const eventEmitter = new EventEmitter();

eventEmitter.on("start", function () {
    console.log("Question 12: Welcome event triggered!");
});

eventEmitter.emit("start");

// Question 13
eventEmitter.on("login", function (username) {
    console.log(`Question 13: User logged in: ${username}`);
});

eventEmitter.emit("login", "Ahmed");

// Question 14
function readFileSynchronously(filePath) {
    try {
        const content = fs.readFileSync(filePath, "utf8");
        console.log("Question 14:", content);
    } catch (error) {
        console.log("Question 14 error:", error.message);
    }
}

const notesFile = path.join(__dirname, "test-files", "notes.txt");
readFileSynchronously(notesFile);

// Question 15
function writeFileAsynchronously(filePath, content) {
    fs.writeFile(filePath, content, "utf8", function (error) {
        if (error) {
            console.log("Question 15 error:", error.message);
            return;
        }

        console.log("Question 15: File saved successfully.");
    });
}

const asyncFile = path.join(__dirname, "test-files", "async.txt");
writeFileAsynchronously(asyncFile, "Async save");

// Question 16
function checkPathExists(filePath) {
    return fs.existsSync(filePath);
}

console.log("Question 16:", checkPathExists(notesFile));

// Question 17
function getSystemInformation() {
    return {
        Platform: os.platform(),
        Arch: os.arch()
    };
}

console.log("Question 17:", getSystemInformation());

// Question 18
function readFileInChunks(filePath) {
    const readStream = fs.createReadStream(filePath, {
        encoding: "utf8",
        highWaterMark: 20
    });

    readStream.on("data", function (chunk) {
        console.log("Question 18 chunk:", chunk);
    });

    readStream.on("end", function () {
        console.log("Question 18: Finished reading the file.");
    });

    readStream.on("error", function (error) {
        console.log("Question 18 error:", error.message);
    });
}

const bigFile = path.join(__dirname, "test-files", "big.txt");
readFileInChunks(bigFile);

// Question 19
function copyFileUsingStreams(sourcePath, destinationPath) {
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destinationPath);

    readStream.pipe(writeStream);

    writeStream.on("finish", function () {
        console.log("Question 19: File copied using streams");
    });

    readStream.on("error", function (error) {
        console.log("Question 19 read error:", error.message);
    });

    writeStream.on("error", function (error) {
        console.log("Question 19 write error:", error.message);
    });
}

const sourceFile = path.join(__dirname, "test-files", "source.txt");
const destinationFile = path.join(__dirname, "test-files", "dest.txt");
copyFileUsingStreams(sourceFile, destinationFile);

// Question 20
function compressFile(sourcePath, destinationPath) {
    pipeline(
        fs.createReadStream(sourcePath),
        zlib.createGzip(),
        fs.createWriteStream(destinationPath),
        function (error) {
            if (error) {
                console.log("Question 20 error:", error.message);
                return;
            }

            console.log("Question 20: File compressed successfully.");
        }
    );
}

const dataFile = path.join(__dirname, "test-files", "data.txt");
const compressedFile = path.join(__dirname, "test-files", "data.txt.gz");
compressFile(dataFile, compressedFile);
