import json
import urllib.request

# 获得响应头信息中的Content-Type域
def urlOpenGetHeaders(url):
    req = urllib.request.Request(url)
    req.add_header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36')
    page = urllib.request.urlopen(req)
    html = page.getheader('Content-Type')
    return html

def processAckunJson():
    contentList = []
    f = open("ackunjson.txt","r",encoding="UTF-8")
    lines = f.readlines() #读取全部内容
    for line in lines:
        if line.find('|') != -1:
            contentList.append(line)

    minId = 99999999999
    maxId = 0
    for line in contentList:
        #print(line)
        line = line.split("|")
        songId = line[0]

        if int(songId) < minId:
            minId = int(songId)

        if int(songId) > maxId:
            maxId = int(songId)

        songData = line[1]
        if len(songData) < 10:
            continue

        ret = json.loads(songData)
        status = ret['state']
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
        writeStr = "%-10s|%-60s|%s"%(songId,songName,downUrl)
        print(writeStr)
        with open("downurl.txt","a",encoding="UTF-8") as f:
            f.write(writeStr)
            f.write("\n")

    print(minId)
    print(maxId)
    for i in range(maxId + 1,minId + 30):
        with open("ackunjson.txt","a") as f:
            f.write(str(i) + " |")
            f.write("\n")
    
if __name__ == '__main__':
    processAckunJson()
