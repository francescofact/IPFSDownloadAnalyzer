# IPFSDownloadAnalyzer

<p align="center"><img src="static/ipfs_logo.png" alt="IPFS Logo" width="150"/></p>

### Description
This project was coded for the first midterm of the course "Peer-to-peer and Blockchains" @ UniPi.

The assignment required to build a small application to monitor and analyze a download from the IPFS network.
My approach was to build a flask WebApp that communicates with [go-ipfs](https://github.com/ipfs/go-ipfs "go-ipfs") through REST requests and at bash level to manage the daemon.

### Features
During the download IPFSDownloadAnalyzer can monitor:
- Peers that helped downloading
- Download progression in time
- Location of helpful peers
- Average download speed
- Current connected peers

## How Build and Run with Docker
Clone the repository and run in the root folder the following commands:

`docker build -t ipfsdownloadanalyzer .`

then, when the image has been built, just run it with:

**Windows:** `docker run --rm -it -v %cd%/downloads:/app/downloads -p 5000:5000 ipfsdownloadanalyzer`

**Linux/macOS:** `docker run --rm -it -v ${PWD}/downloads:/app/downloads -p 5000:5000 ipfsdownloadanalyzer `

>If you want to keep the container after usage, remove `--rm` from the command

This will make docker downloads and installs all the file needed and start building the container. 
After that, you can browse to http://localhost:5000/ to use the app. The downloads will be in the "downloads" folder in your current directory
