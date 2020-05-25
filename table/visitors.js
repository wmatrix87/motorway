const Index = require('./index');

class Visitors extends Index {
  set(visitor) {
    const { date, name } = visitor;
    const givenDate = new Date(date);
    const isWeekend = [6, 0].includes(givenDate.getDay());
    if(this.currentDate > givenDate && !isWeekend){
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
}


module.exports = Visitors;
