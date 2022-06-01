const { Schema, model } = require('mongoose')

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'moderation'
  },
  show: {
    type: Boolean,
    default: true
  },
  showAll: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now // по дефолту текущее время
  },
  views: {
    type: Number,
    default: 0
  },
  imageUrl: String,
  folder: {
    type: Schema.Types.String,
    required: true,
    ref: 'Folder'
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'comments'
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = model('Posts', PostSchema)
