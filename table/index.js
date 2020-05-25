class Index {
  constructor() {
    this.data = {};
    this.currentDate = new Date(new Date().toJSON().slice(0,10));
  }
  set(name) {
    if (this.data[name]) {
      this.data[name] += 1;
    } else {
      this.data[name] = 1;
    }

    return this.data;
  }
  get(key) {
    return this.data[key] ;
  }
  getData() {
    return this.data;
  }
}



module.exports = Index;
