import requests
from flask import current_app
from geoip import geolite2


def post(url, json=True):
    """
    Send POST request
    :param url:
    :param data:
    :return: JSON response || None
    """
    r = requests.post(current_app.config["BASE_URL"] + url)
    if json == True:
        return r.json()
    return r.text


def filter_ip(addr):
    """
    Isolate the IP from protocols and ports
    :param addr: Addr from getPeers()
    :return: plain IP Address
    """
    addr = addr.split("/")
    return addr[2]


def get_ip_nation(ip):
    info = geolite2.lookup(ip)
    if info is None:
        return "WORLD"
    else:
        return info.country