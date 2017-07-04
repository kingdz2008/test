import urllib.request
import os
import time
import datetime

from Crypto import Random
from Crypto.Hash import SHA
from Crypto.Cipher import PKCS1_v1_5 as Cipher_pkcs1_v1_5
from Crypto.Signature import PKCS1_v1_5 as Signature_pkcs1_v1_5
from Crypto.PublicKey import RSA

def url_open(url):
    req = urllib.request.Request(url)
    req.add_header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36')
    page = urllib.request.urlopen(req)
    html = page.read()

    return html

def download(title,post,url):
    filename = title + "." +post
    with open(filename, 'wb') as f:
        music = url_open(url)
        f.write(music)

def download_mai():
    # 伪随机数生成器
    random_generator = Random.new().read
    # rsa算法生成实例
    rsa = RSA.generate(1024, random_generator)

    # master的秘钥对的生成
    private_pem = rsa.exportKey()

    with open('master-private.pem', 'wb') as f:
        f.write(private_pem)

    public_pem = rsa.publickey().exportKey()
    with open('master-public.pem', 'wb') as f:
        f.write(public_pem)

    # ghost的秘钥对的生成
    private_pem = rsa.exportKey()
    with open('master-private.pem', 'wb') as f:
        f.write(private_pem)

    public_pem = rsa.publickey().exportKey()
    with open('master-public.pem', 'wb') as f:
        f.write(public_pem)

def download_mai1():
    "http://www.aekun.com/api/getMusicbyid/"
    start = 528
    baseUrl = "http://www.itingwa.com/listen/"

    while True:
        now = datetime.datetime.now()
        now = now.strftime('%Y-%m-%d %H:%M:%S')
        print(now)
        print(start)
        url = baseUrl + str(start)
        html = url_open(url).decode('utf-8')

        a = html.find("页面未找到")
        if a != -1:
            time.sleep(3)
            start = start + 1
            continue
            
        a = html.find("frame1")
        a = html.find("<h1>", a) + 4
        b = html.find("<a href", a)
        title = str(start) + " - " + html[a:b].strip()
        title = title.replace('*','-')
        print(title)

        a = html.find("<div id=\"tw_player\"", b)
        a = html.find("http", a)
        b = html.find("</div>", a) - 2
        downUrl = html[a:b]
        print(downUrl)

        post = downUrl[-3:]
        print(post)

        try:
            download(title,post,downUrl)
            print("begin to sleep")
            time.sleep(2)
        except ConnectionResetError:
            start = start - 1

        start = start + 1
    
if __name__ == '__main__':
    download_mai()
