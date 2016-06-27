(function(module) {

  function ParkData(opts){
    Object.keys(opts).forEach(function(e, index, keys) {
      this[e] = opts[e];
    },this);
  }
  ParkData.allParks = [];

  ParkData.createTable = function(){
    webDB.execute(
      'CREATE TABLE IF NOT EXISTS parks_database (' +
        'id INTEGER PRIMARY KEY, ' +
        'name VARCHAR NOT NULL, ' +
        'address VARCHAR NOT NULL, ' +
        'feature VARCHAR NOT NULL, ' +
        'hours VARCHAR, ' +
        'lat FLOAT, ' +
        'lng FLOAT, ' +
        'lighting BOOLEAN);',
        function() {
          console.log('successfully set up parks database table');
        }
    );
  };

  ParkData.prototype.insertRecord = function (){
    webDB.execute(
      [
        {
          'sql': 'INSERT INTO parks_database (name, address, feature, hours, lat, lng, lighting) VALUES (?, ?, ?, ?, ?, ?, ?);',
          'data': [this.name, this.location_1_address, this.feature_desc, this.hours, this.xpos, this.ypos, this.lighting]
        }
      ]
    );
  };

  ParkData.requestData = function() {
    webDB.execute('SELECT * FROM parks_database', function(rows) {
      if (rows.length) {
        ParkData.allParks = rows.map(function(ele) {
          return new ParkData;
        });
      } else {
        $.get('https://data.seattle.gov/resource/64yg-jvpt.json')
        .done(function(data){
          data.forEach(function(item){
            var parkObject = new ParkData(item);
            parkObject.insertRecord();
          });
          webDB.execute('SELECT * FROM parks_database', function(rows){
            ParkData.allParks = rows.map(function(ele) {
              return new ParkData;
            });
          });
        });
      }
    });
  };

















  module.ParkData = ParkData;
})(window);