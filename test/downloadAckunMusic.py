#!/bin/env python
# coding=utf8
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5 as Cipher_pkcs1_v1_5
import base64
import requests
import json
import urllib

def urlOpen(url):
    req = urllib.request.Request(url)
    req.add_header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36')
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

# 获取pKey
f = open('public.pem')
pKey = f.read()
f.close()

songId = "3509519"
songId = songId.encode('utf-8')
print(songId)
songidVal = getPostStr(pKey, songId)
#ret = getSongRealUrl(songidVal)
#ret = ret.decode('utf-8')
ret = '{"state":"success","message":"ok","action":null,"data":{"url":"http://us.aekun.com/upload/75AAB77BC2D16123F9F2E8B6C68FCB8E.mp3","song_name":"就算遇到挫折、受到嘲笑，也要勇敢的向前跑！","coll":0,"singername":"小哥","singerpic":"https://m4.aekun.com/user_l_5973822_20170513135220.png"}}'
print(ret)
ret = json.loads(ret)
print(ret)
status = ret['state']
print(status)
downUrl = ret['data']['url']
print(downUrl)
post = downUrl[-3:]
print(post)
songName = ret['data']['song_name']
print(songName)
download(songName,post,downUrl)
print("download ok")
