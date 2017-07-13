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

# 获得响应头信息中的Content-Type域
def urlOpenGetHeaders(url):
    req = urllib.request.Request(url)
    req.add_header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36')
    page = urllib.request.urlopen(req)
    html = page.getheader('Content-Type')
    return html

# 获得url的源码
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

# 根据名字、后缀和url下载到本地文件夹
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

# 获取歌曲的实际的url
def getSongRealUrl(songidVal):
    url = 'http://www.aekun.com/api/getMusicbyid/'
    r = requests.post(url, {
        'songid': songidVal
    })
    return r.content

# 将需要的数据写入本地文件
def writeStrToFile(writeStr):
    print(writeStr)
    with open("downurl.txt","a",encoding="UTF-8") as f:
        f.write(writeStr)
        f.write("\n")

# 获取最新的推荐歌曲编号
def getMaxSongs():
    url = "http://www.aekun.com/new/"
    html = urlOpen(url).decode('utf-8')
    a = html.find('<tr musicid=') + 13
    b = html.find('"',a)
    result = int(html[a:b])
    return result

# 获取目前已经获得的最大曲目编号
def getNowSongId(songIdInt):
    f = open("downurl.txt","r",encoding="UTF-8")
    lines = f.readlines() #读取全部内容
    for line in lines:
        if line.find('|')!=-1:
            line = line.split("|")
            line = int(line[0])
            if line > songIdInt:
                songIdInt = line
    return songIdInt

# 下载歌曲的主程序部分
def downloadMusicMain():
    # 获取pKey
    f = open('public.pem')
    pKey = f.read()
    f.close()

    songIdInt = 3509719
    songIdInt = getNowSongId(songIdInt)
    songIdInt = songIdInt + 1
    maxSong = getMaxSongs()
    print("start from:%s,end with:%s"%(songIdInt,maxSong))
    # 3505251			|10			|2015084685			|▌▌Chillout ▌▌Losing Ground Michael FK & Groundfold  -----3505251.mp3
    while(True):
        if songIdInt > maxSong:
            break
        
        time.sleep(10)
        try:
            urlOpen("http://www.aekun.com/song/" + str(songIdInt))
        except ConnectionResetError:
            print("Error occur")
        songId = str(songIdInt).encode('utf-8')
        print(songId)
        songidVal = getPostStr(pKey, songId)
        
        try:
            ret = getSongRealUrl(songidVal)
        except (ConnectionError , ConnectionResetError):
            print("ConnectionError")
            time.sleep(3)
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
        if isinstance(downUrl,str):
            if downUrl.strip() == '':
                html = urlOpen("http://www.aekun.com/song/" + str(songIdInt)).decode('utf-8')
                songIdInt = songIdInt + 1
                continue
        elif isinstance(downUrl,dict):
            pass
        else:
            continue

        downUrl = ret['data']['url']
        if downUrl is None:
            continue
        if downUrl.strip() == "":
            continue
        post = downUrl[-3:]
        post = post.lower()
        if post != 'mp3' and post != 'm4a':
            tmp = urlOpenGetHeaders(downUrl)
            if tmp.find('mp3') != -1:
                post = 'mp3'
        songName = ret['data']['song_name']
        writeStr = "%-10s|%-50s|%-5s|%s"%(songIdInt,songName,post,downUrl)
        writeStrToFile(writeStr)
        songIdInt = songIdInt + 1

if __name__ == '__main__':
    downloadMusicMain()
