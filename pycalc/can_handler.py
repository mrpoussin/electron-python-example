from __future__ import print_function
import can

class CanHandler(object):
    
    def __init__(self):
        self.bus = can.interface.Bus(bustype='pcan', channel='PCAN_USBBUS1', bitrate=250000)
        print("test")

    def send_one(self):

        bus = self.bus
        msg = can.Message(arbitration_id=0xc0ffee,
                          data=[0, 25, 0, 1, 3, 1, 4, 1],
                          extended_id=True)
        try:
            bus.send(msg)
            print("Message sent on {}".format(bus.channel_info))
        except can.CanError:
            print("Message NOT sent")
        
        return "Message sent"

if __name__ == '__main__':

    canHandler = CanHandler()
    canHandler.send_one()