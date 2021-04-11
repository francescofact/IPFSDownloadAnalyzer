from flask import Flask, render_template

import ipfsAPI
import myUtils

app = Flask(__name__)
app.config["BASE_URL"] = "http://127.0.0.1:5001/api/v0/"
app.config["DOWNLOAD_PATH"] = "/app/downloads/"

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/api/download/<cid>')
def start_download(cid):
    return {"status": ipfsAPI.download_file(cid, app.config["DOWNLOAD_PATH"]+cid),
            "size": ipfsAPI.get_file_size(cid)}

@app.route('/api/watchdog')
def watchdog():
    """
    Respond to frontend update request
    """
    peers = ipfsAPI.get_peers()
    peers_plus = {}
    for peer in peers:
        ledger = ipfsAPI.consult_ledger(peer[0])
        if ledger != [0, 0]:
            peers_plus[peer[0]] = [peer[1], myUtils.get_ip_nation(peer[1]), ledger]
    downloading = ipfsAPI.is_downloading()
    return {"connected": len(peers), "peers": peers_plus, "status": downloading["status"], "downloaded": myUtils.getDownloadedSize(app.config["cid"])}

@app.route('/api/status')
def status():
    return ipfsAPI.is_downloading()

@app.route('/api/reset')
def reset():
    ipfsAPI.reset_ipfs()
    return "Done"


if __name__ == '__main__':
    app.run()
