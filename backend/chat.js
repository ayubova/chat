module.exports = class Chat {
  constructor() {
    this.clients = new Set();
  }

  subscribe(res) {
    this.clients.add(res);
    res.on("close", () => this.clients.delete(res));
  }

  publish(message) {
    this.clients.forEach(res => res.end(JSON.stringify(message)));
    this.clients.clear();
  }
};
