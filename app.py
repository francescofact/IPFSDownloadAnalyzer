from flask import Flask, render_template
import ipfsAPI

app = Flask(__name__)
app.config["BASE_URL"] = "http://127.0.0.1:5001/api/v0/"

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/api/download/<cid>')
def start_download(cid):
    return {"status": ipfsAPI.download_file("QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm", "/home/francesco/ipfs/winrar"),
            "size": ipfsAPI.get_file_size(cid)}

@app.route('/api/download_est')
def download_est():
    return {"estimation": ipfsAPI.download_estimation()}

@app.route('/api/status')
def status():
    return ipfsAPI.is_downloading()

@app.route('/api/reset')
def reset():
    ipfsAPI.reset_ipfs()
    return "Done"


if __name__ == '__main__':
    app.run()
