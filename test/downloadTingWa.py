import urllib.request
import os
import time
import datetime

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
