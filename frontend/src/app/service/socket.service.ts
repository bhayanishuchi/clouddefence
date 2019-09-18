import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private socket: Socket) {
  }

  newconnection() {
    return this.socket;
  }

  login(name, password, cb) {
    const that = this;
    this.socket.emit('new user', [name, password], function (data, msg) {
      if (data) {
        cb(null, [data]);
      } else {
        cb(msg, null);
      }
    });
  }

  hello(mysocket, cb) {
    mysocket.on('hi', function (data) {
      console.log('from service', data);
      cb([data]);
    });
  }

  loadMessage(cb) {
    this.socket.on('load old msgs', function (data) {
      cb(data);
    });
  }

  findMessage(name, cb) {
    const that = this;
    this.socket.emit('find message', name);
    this.notification(function (notificationdata) {
      that.loadMessage(function (msgData) {
        cb([notificationdata, msgData]);
      });
    });
  }

  findLastMessage(name, cb) {
    const that = this;
    this.socket.emit('findLastMessage', name, function (err, messages) {
      if (err) {
        cb(err, null);
      } else {
        cb(null, messages);
      }
    });
  }

  newmessage(cb) {
    this.socket.on('new message', function (msgdata) {
      cb(msgdata);
    });
  }

  notification(cb) {
    console.log('notification callback');
    this.socket.on('notification', function (users, message, activeUser) {
      cb([users, message, activeUser]);
    });
  }

  sendMessage(name, currentDate, cb) {
    this.socket.emit('send message', [name, currentDate], function (data) {
      console.log('err,data', data);
      if (data) {
        cb(data);
      }
    });
  }

  getOnlineUserList(cb) {
    this.socket.emit('getOnlineUser', function (data) {
      cb(data);
    });
  }
}
