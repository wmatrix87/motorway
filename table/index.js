class Index {
  constructor() {
    this.data = {};
    this.currentDate = new Date(new Date().toJSON().slice(0,10)); // begin of current day
    this.weekDays = [1,2,3,4,5]; // 1 - mon, 2 - tue, 3 - wen, 4 - thu, 5 - fri
  }
  set(visitor) {
    const { date, name } = visitor;
    const givenDate = new Date(date);
    const isWeekDays = this.weekDays.includes(givenDate.getDay());

    if(this.currentDate > givenDate && isWeekDays){
      if (this.data[name]) {
        this.data[name] += 1;
      } else {
        this.data[name] = 1;
      }
    }
    
    return this.data;
  }
  setAll(visitors) {
    visitors.forEach(visitor => this.set(visitor));
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
