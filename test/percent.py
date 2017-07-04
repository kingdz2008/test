import time
from time import sleep
from tqdm import tqdm

for i in range(1,4):
    print(i,end='\r')
    time.sleep(3)

print('\n\n')

for i in tqdm(range(1, 500)):
    sleep(0.01)
