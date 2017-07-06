#!/bin/env python
# coding=utf8
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5 as Cipher_pkcs1_v1_5
import base64
import requests
import json
import urllib
import time
import random

def urlOpenGetHeaders(url):
    req = urllib.request.Request(url)
    req.add_header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36')
    page = urllib.request.urlopen(req)
    html = page.getheader('Content-Type')
    return html


def urlOpen(url):
    req = urllib.request.Request(url)
    req.add_header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36')

    if False:
        proxies = ['110.73.8.151:8123', '110.73.10.78:8123', '36.249.193.19:8118']
        proxy = random.choice(proxies)
        proxy_support = urllib.request.ProxyHandler({'http':proxy})
        opener = urllib.request.build_opener(proxy_support)
        opener.addheaders = [('User-Agent','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36')]
        urllib.request.install_opener(opener)
        page = urllib.request.urlopen(url)
    else:
        page = urllib.request.urlopen(req)
        
    html = page.read()
    return html

def download(title,post,url):
    filename = title + "." +post
    with open(filename, 'wb') as f:
        music = urlOpen(url)
        f.write(music)

def getPostStr(pKey, song_id):
    rsaKey = RSA.importKey(pKey)
    cipher = Cipher_pkcs1_v1_5.new(rsaKey)
    encry = cipher.encrypt(song_id)
    return base64.b64encode(encry)

def getSongRealUrl(songidVal):
    url = 'http://www.aekun.com/api/getMusicbyid/'
    r = requests.post(url, {
        'songid': songidVal
    })
    return r.content

def writeStrToFile(writeStr):
    print(writeStr)
    with open("downurl.txt","a") as f:
        f.write(writeStr)
        f.write("\n")

def downloadMusicMain():
    # 获取pKey
    f = open('public.pem')
    pKey = f.read()
    f.close()

    songIdInt = 3506344
# 3505251			|10			|2015084685			|▌▌Chillout ▌▌Losing Ground Michael FK & Groundfold  -----3505251.mp3
    while(True):
        time.sleep(10)
        try:
            urlOpen("http://www.aekun.com/song/" + str(songIdInt))
        except ConnectionResetError:
            print("Error occur")
        songId = str(songIdInt).encode('utf-8')
        songIdInt = songIdInt + 1
        print(songId)
        songidVal = getPostStr(pKey, songId)
        
        try:
            ret = getSongRealUrl(songidVal)
        except ConnectionError:
            print("ConnectionError")
            continue
        
        ret = ret.decode('utf-8')
        #ret = '{"state":"success","message":"ok","action":null,"data":{"url":"http://us.aekun.com/upload/75AAB77BC2D16123F9F2E8B6C68FCB8E.mp3","song_name":"就算遇到挫折、受到嘲笑，也要勇敢的向前跑！","coll":0,"singername":"小哥","singerpic":"https://m4.aekun.com/user_l_5973822_20170513135220.png"}}'
        print(ret)
        ret = json.loads(ret)
        print(ret)
        status = ret['state']
        if status != 'success':
            print(status)
            break
        downUrl = ret['data']
        if isinstance(downUrl,str) and downUrl.strip() == '':
            html = urlOpen("http://www.aekun.com/song/" + str(songIdInt)).decode('utf-8')
            #print(html)
            continue
        #print("[",downUrl,"]")
        downUrl = ret['data']['url']
        if downUrl.strip() == "":
            continue
        #print(downUrl)
        post = downUrl[-3:]
        post = post.lower()
        if post != 'mp3' and post != 'm4a':
            tmp = urlOpenGetHeaders(downUrl)
            if tmp.find('mp3') != -1:
                post = 'mp3'
        #print(post)
        songName = ret['data']['song_name']
        #print(songName)
        #download(songName,post,downUrl)
        #print("download ok")
        writeStr = "%-10s|%-50s|%-5s|%s"%((songIdInt - 1),songName,post,downUrl)
        writeStrToFile(writeStr)

if __name__ == '__main__':
    downloadMusicMain()
