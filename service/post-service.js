const PostModel = require('../models/post-model')
const FolderModel = require('../models/folder-model')
const ApiError = require('../exceptions/api-error')
const tokenService = require('./token-service.js')

class PostService {
  async addPost (refreshToken, title, description, folder, show, showAll) {
    const post = await PostModel.findOne({title})
    if (post) {
      throw ApiError.BadRequest(`Пост ${title} уже создан`)
    }
    const folderName = await FolderModel.findOne({name: folder})
    if (!folderName) {
      throw ApiError.BadRequest(`Категории ${folder} нет`)
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const postData = await PostModel.create({user: userData.id, title, description, folder: folderName.name, show, showAll})
    return { postData }
  }

  async setPost(_id, title, description, folder, show, showAll) {
    const Post = await PostModel.findOne({_id})
    if (!Post) {
      throw ApiError.BadRequest(`Поста ${name} нет в списке`)
    }
    const folderName = await FolderModel.findOne({name: folder})
    if (!folderName) {
      throw ApiError.BadRequest(`Категории ${folder} нет`)
    }
    const PostData = await Post.updateOne({title, description, folder: folderName.name, show, showAll})
    return { PostData }
  }

  async editPost(_id) {
    const Post = PostModel.find({_id});
    if (!Post) {
      throw ApiError.BadRequest(`Поста ${_id} нет`)
    }
    return Post;
  }

  async removePost(_id) {
    const Post = await PostModel.findOne({_id})
    if (!Post) {
      throw ApiError.BadRequest(`Поста ${id} нет в списке`)
    }
    const PostData = await PostModel.deleteOne({_id});
    return PostData;
  }

  async getPosts(folder) {
    const Post = PostModel.find({folder, status: 'active'});
    return Post;
  }

  async getPostsFolderUser(refreshToken, folder) {
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const Post = PostModel.find({folder, user: userData.id});
    return Post;
  }

  async getPostsUser(refreshToken) {
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const Post = PostModel.find({user: userData.id});
    return Post;
  }

  async getPostsModeration(refreshToken) {
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const Post = PostModel.find({status: 'moderation'});
    return Post;
  }

  async setPublishPost(_id) {
    const Post = await PostModel.findOne({_id})
    if (!Post) {
      throw ApiError.BadRequest(`Поста ${id} нет в списке`)
    }
    const PostData = await Post.updateOne({'status': 'active'});
    return PostData;
  }
}

module.exports = new PostService()
