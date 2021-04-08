from flask import current_app

import myUtils
import subprocess, time


# REST FUNCTIONS

def get_peers():
    """
    Get the list of connected peers
    :return: list of peers' ID and IP addr
    """
    # in CLI: ipfs swarm peers

    peers = myUtils.post("swarm/peers")
    return [[d['Peer'], myUtils.filter_ip(d['Addr'])] for d in peers["Peers"]]


def consult_ledger(peer_id):
    """
    Get info about a peer checking the ledger
    :param peer_id: Peer ID to check in the ledger
    :return: [dataSent, dataReceived] in Bytes
    """
    # in CLI: ipfs bitswap ledger <peerID>

    ledger = myUtils.post("bitswap/ledger?arg={}".format(peer_id))
    return [ledger["Sent"], ledger["Recv"]]


def get_file_size(cid):
    """
    Get the file size given a cid
    :param cid: file cid
    :return: file size in Bytes
    """
    # in CLI: ipfs object stat <cid>
    stat = myUtils.post("object/stat?arg={}".format(cid))
    if "CumulativeSize" in stat:
        return int(stat["CumulativeSize"])
    else:
        return "Invalid Request"


def is_downloading():
    """
    Check if there is a get running
    :return: dict
    """
    cmds = myUtils.post("diag/cmds")
    for cmd in cmds:
        if cmd["Active"] and cmd["Command"] == "get":
            return {"status": "active", "file": cmd["Args"][0]}

    return {"status": "idle"}


def download_estimation():
    """
    Calculate downloaded data from peers
    :return: Downloaded data in Bytes
    """
    if is_downloading() != {"status": "idle"}:
        peers = get_peers()
        total = 0
        for peer in peers:
            data = consult_ledger(peer[0])
            total = total + int(data[1])
        return total
    else:
        return -1


# SHELL FUNCTIONS

def reset_ipfs():
    # shutdown existing
    command = "killall -9 ipfs"  # brutal but "ipfs shutdown" create problems
    process = subprocess.Popen(command.split(), shell=False, stdout=subprocess.PIPE)
    process.wait()
    # spawn existing
    command = "ipfs daemon"
    process = subprocess.Popen(command.split(), shell=False, stdout=subprocess.PIPE)
    return


def kill_subprocess():
    if "process" in current_app.config:
        process = current_app.config["process"]
        if type(process) == subprocess.Popen:
            process.kill()


def download_file(cid, output=""):
    """
    Pipline to download a file with the ipfs daemon
    :param cid: file cid
    :param output: destination folder
    :return:
    """
    # Let's reboot the daemon to clear stats and pending
    kill_subprocess()
    print("Subprocess killed")
    time.sleep(1)
    reset_ipfs()
    print("IPFS Daemon (re)started")
    time.sleep(4)

    # Clear Cache
    myUtils.post("repo/gc", False)
    print("Cache clear!")
    time.sleep(2)
    # Start download
    command = "ipfs get -o {} {}".format(output, cid)
    process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)

    return "started"
