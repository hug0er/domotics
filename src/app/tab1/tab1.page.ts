import { Component } from '@angular/core';
import {Paho} from 'ng2-mqtt/mqttws31';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  lamparas = [
    {name: '0', color: undefined, estado: 1, currentColor: undefined},
    {name: '1', color: undefined, estado: 1, currentColor: undefined},
    {name: '2', color: undefined, estado: 1, currentColor: undefined},
    {name: '3', color: undefined, estado: 1, currentColor: undefined},
]
  client;
  constructor(){
    this.client = new Paho.MQTT.Client('192.168.88.198', 9001, '/home/prueba', this.makeid(10));
    this.onMessage();
    this.onConnectionLost();
    this.client.connect({onSuccess: this.onConnected.bind(this)});

  }

  makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  luces(lampara) {
    let message = lampara.estado === 0 ? 'estado:1:'+lampara.name : 'estado:0:'+lampara.name 
    let packet = new Paho.MQTT.Message(message);
    packet.destinationName = "/home/prueba";
    this.client.send(packet);
  }

  color(lampara) {
    let message = 'color:'+lampara.color.hex +':'+lampara.name
    let packet = new Paho.MQTT.Message(message);
    packet.destinationName = "/home/prueba";
    this.client.send(packet);
    lampara.color  = undefined
  }

  onConnected() {
    console.log("Connected");
    this.client.subscribe("/home/prueba");
  }

  onMessage() {
    this.client.onMessageArrived = (message: Paho.MQTT.Message) => {    
      let tmp = message.payloadString.split(":")
      let number = parseInt(tmp[2])
      if (tmp[0] === "estado") {
        this.lamparas[number].estado = parseInt(tmp[1])
      } else {
        this.lamparas[number].currentColor = tmp[1]
      }
      
    };
  }

  onConnectionLost() {
    this.client.onConnectionLost = (responseObject: Object) => {
      console.log('Connection lost : ' + JSON.stringify(responseObject));
    };
  }
}
