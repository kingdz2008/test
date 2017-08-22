import xlrd
import os

def process():
    excelfile = xlrd.open_workbook('excel.xls')
    sheetOne = excelfile.sheets()[0]        #通过索引顺序获取
    rows = sheetOne.nrows     #获得行数
    cols = sheetOne.ncols     #获得列数
    print(rows)
    print(cols)

    
    colB = sheetOne.col_values(1)       #获取列内容

    space = ' '
    print('<table>')
    for row in range(1,rows):
        rows = sheetOne.row_values(row)              #获取行内容
        print(space,'<tr>')
        for content in rows:
            if len(content) < 20:
                print(space,space,'<td>',content,'</td>')
                continue
            print(space,space,'<td>')
            print(space,space,content)
            print(space,space,'</td>')
        print(space,'</tr>')
    print('</table>')
    

if __name__ == '__main__':
    process()
