const mongoose = require('mongoose');

const smoothieSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    fruits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Fruit' }]
  }, {
    timestamps: true 
});

const Smoothie = mongoose.model('Smoothie', smoothieSchema);

module.exports = Smoothie;