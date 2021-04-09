# IPFSDownloadAnalyzer

<p align="center"><img src="static/ipfs_logo.svg" alt="IPFS Logo" width="150"/></p>

### Description
This project was coded for the first midterm of the course "Peer-to-peer and Blockchains" @ UniPi.

The assignment required to build a small application to monitor and analye a download from the IPFS network.
My approach was to build a flask WebApp that communicates with [go-ipfs](https://github.com/ipfs/go-ipfs "go-ipfs") though REST request and at bash level to restart it or start downloads.

### Features
During the download IPFSDownloadAnalyzer can monitor
- Peers that helped downloading
- Download progression in time
- Location of helpful peers
- Average download speed
- Current connected peers

## Install
At the moment there is no docker or automated configuration, but in the next day i'm implementing a Dockerfile.
To install it you need
- go-ipfs ( [install](https://github.com/ipfs/go-ipfs#install "Install go-ipfs") )
- Python3 and requirements
