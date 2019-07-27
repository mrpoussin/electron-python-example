from __future__ import print_function
from calc import calc as real_calc
import sys
import zerorpc
import can_handler

class CanApi(object):

    def __init__(self):
        self.canHandler = can_handler.CanHandler()
        
    def send_test(self):
        self.canHandler.send_one()
    
    def echo(self, text):
        """echo any text"""
        return text

class CalcApi(object):
    def calc(self, text):
        """based on the input text, return the int result"""
        try:
            return real_calc(text)
        except Exception as e:
            return 0.0    
    def echo(self, text):
        """echo any text"""
        return text

def parse_port():
    port = 4242
    try:
        port = int(sys.argv[1])
    except Exception as e:
        pass
    return '{}'.format(port)

def main():

     
    addr = 'tcp://127.0.0.1:' + parse_port()
    s = zerorpc.Server(CanApi())
    s.bind(addr)
    print('start running on {}'.format(addr))
    s.run()

if __name__ == '__main__':
    main()
