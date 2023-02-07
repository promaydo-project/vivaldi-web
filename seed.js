var seeder = require('mongoose-seed');


// Connect to MongoDB via Mongoose
seeder.connect('mongodb://127.0.0.1:27017/db_perpus', function () {

  // Load Mongoose models
  seeder.loadModels([
    './models/Users'
  ]);

  // Clear specified collections
  seeder.clearModels(['Users'], function () {

    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });

  });
});

var data = [
{ 'model': 'Users',
    'documents': [
      {
        username: 'admin',
        password: 'rahasia',
      }
    ]
  }
];