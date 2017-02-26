var socket = io();

var vm = new Vue({
  el: '#app',
  data: {
    pages: {},
    referrers: {},
		activeUsers: 0,
    server: {},
    serverUptime: 0
  },
  created: function() {
    socket.on('updated-stats', function(data) {
			this.pages = data.pages;
			this.referrers = data.referrers;
			this.activeUsers = data.activeUsers;
      this.server = data.server;
      this.serverUptime = data.serverUptime

    }.bind(this));
  }
});
