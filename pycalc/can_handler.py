from __future__ import print_function
import can
from can import Message
from can.bus import BusState
import struct
import serial

class myPrinter(can.Listener):
    
    def __init__(self,msgList):
        self.msgList = msgList
        

    def on_message_received(self, msg):
        index = self.getListPosition(msg.arbitration_id)
        smsg=SimpleMsg(msg)
        if index:
            self.msgList[index-1] = smsg
        else:
            self.msgList.append(smsg)


    def getListPosition(self,arbitration_id):
        idx=0
        for  msg in self.msgList:
            idx+=1
            if msg.id == id:
                return idx
        return 0


class SimpleMsg:
    def __init__(self,msg):
        self.id = int(msg.arbitration_id)
        self.data = int.from_bytes(msg.data,byteorder='big')
        

    

class CanHandler(object):
    
    def __init__(self):

        self.busType = 'pcan'
        self.bitrate = '250000'
        self.canChannel = ''
        self.isExtended = True
        self.bus = None
        self.notifier = None
        self.msgList = []
        self.pollInterval = 0.1
        
    def connectToBus(self,canSettings):
        
        if self.bus is not None:
            {        
            self.bus.shutdown()
            }

        if canSettings[0] == 'pcan':
            self.canChannel = 'PCAN_USBBUS1'

        
        self.bus = can.interface.Bus(bustype = canSettings[0], channel= self.canChannel, bitrate=canSettings[1])
        self.isExtended = canSettings[2]
        self.notifier = can.Notifier(self.bus,[myPrinter(self.msgList)])
        self.msgList

        settingsStr = 'New settings are : {}'.format(canSettings)
        return settingsStr

    def send_one(self):

        bus = self.bus
        msg = can.Message(arbitration_id=0xc0ffee,
                          data=[0, 25, 0, 1, 3, 1, 4, 1],
                          extended_id= self.isExtended)
        try:
            bus.send(msg)
            print("Message sent on {}".format(bus.channel_info))
        except can.CanError:
            print("Message NOT sent")
        
        return "Message sent"


    def receive_all(self):
        pass


if __name__ == '__main__':

    canHandler = CanHandler()
    canHandler.send_one()