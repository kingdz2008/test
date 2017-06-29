import urllib.request
import urllib
import os
from lxml import etree

space = "\t\t"

def url_open(url):
    req = urllib.request.Request(url)
    req.add_header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36')
    page = urllib.request.urlopen(req)
    html = page.read()
    return html

def getAmazonPrice(search):
    amazonurl = "https://www.amazon.cn/s/ref=nb_sb_noss_2/462-3718618-2688046?field-keywords=" + search
    html = url_open(amazonurl).decode('utf-8')
    with open("html.txt","w",encoding='utf-8') as f:
        f.write(html)
    selector = etree.HTML(html)
    for i in range(1,10):
        name = selector.xpath(".//*[@id='s-results-list-atf']/li["+ str(i) +"]/div/div[3]/div[1]/a")[0].xpath('string(.)').strip()
        print(name)

def getDangDangPrice(search):
    dangdangurl = "http://search.dangdang.com/?key=" + search + "&act=input"
    html = url_open(dangdangurl).decode('gb2312')
    selector = etree.HTML(html)
    print("当当网价格列表")
    for i in range(1,10):
        name = selector.xpath(".//*[@id='search_nature_rg']/ul/li["+ str(i) +"]/a/@title")[0].strip()
        price = selector.xpath(".//*[@id='search_nature_rg']/ul/li["+ str(i) +"]/p[3]/span/text()")[0].strip()
        if price.find('电子书') == -1:
            print(price + space + name)
    print("")


def getJDPrice(search):
    jdurl = "https://search.jd.com/Search?keyword=" + search + "&enc=utf-8"
    html = url_open(jdurl).decode('utf-8')
    selector = etree.HTML(html)
    print("京东商城价格列表")
    for i in range(1,10):
        name = selector.xpath(".//*[@id='J_goodsList']/ul/li["+ str(i) +"]/div/div[3]/a/em")[0].xpath('string(.)')
        price = selector.xpath(".//*[@id='J_goodsList']/ul/li["+ str(i) +"]/div/div[2]/strong/i")[0].xpath('string(.)')
        print(price + space + name)
    print("")

def test():
    string = '<div id="test3">我左青龙，<span id="tiger">右白虎，<ul>上朱雀，<li>下玄武。</li></ul>老牛在当中，</span>龙头在胸口。<div>'
    selector = etree.HTML(string)
    data = selector.xpath('//div[@id="test3"]')[0].xpath('string(.)')
    print(data)

def getPrice():
    search = "spring boot"
    print("查询的关键字：" + search + "\n")
    search = urllib.parse.quote(search)
    #test()
    
    #getJDPrice(search)
    #getDangDangPrice(search)
    getAmazonPrice(search)

if __name__ == '__main__':
    getPrice()
