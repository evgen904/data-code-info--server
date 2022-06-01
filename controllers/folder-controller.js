const folderService = require('../service/folder-service')
const ApiError = require('../exceptions/api-error')

class FolderController {
  async add(req, res, next) {
    try {
      const {name, title} = req.body;
      const {refreshToken} = req.cookies;
      const folderData = await folderService.addFolder(refreshToken, name, title);
      return res.json(folderData)
    } catch (e) {
      next(e)
    }
  }

  async remove(req, res, next) {
    try {
      const {_id} = req.body;
      const folderData = await folderService.removeFolder(_id)
      return res.json(folderData)
    } catch (e) {
      next(e)
    }
  }

  async set(req, res, next) {
    try {
      const {name, title, isPublic} = req.body;
      const folderData = await folderService.setFolder(name, title, isPublic);
      return res.json(folderData)
    } catch (e) {
      next(e)
    }
  }

  async getFolders(req, res, next) {
    try {
      const folders = await folderService.getFolders();
      return res.json(folders)
    } catch (e) {
      next(e)
    }
  }

  async getFoldersUser(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const folders = await folderService.getFoldersUser(refreshToken);
      return res.json(folders)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new FolderController();
