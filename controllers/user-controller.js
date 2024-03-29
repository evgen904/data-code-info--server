const userService = require('../service/user-service')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
      }
      const {email, password, login} = req.body;
      const userData = await userService.registration(email, password, login)
      // httpOnly нельзя получать и изменять куку внутри браузера
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async activationmail(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await userService.activationmail(refreshToken)
      // httpOnly нельзя получать и изменять куку внутри браузера
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async login(req, res, next) {
    try {
      const {login, password} = req.body;
      const userData = await userService.login(login, password);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(token)
    } catch (e) {
      next(e)
    }
  }

  async activate(req, res, next) {
    try {
      const activateLink = req.params.link
      await userService.activate(activateLink)
      return res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e)
    }
  }

  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users)
    } catch (e) {
      next(e)
    }
  }

  async roleAdd(req, res, next) {
    try {
      const {role} = req.body;
      if (!role) {
        return next(ApiError.BadRequest('Роль не указана'))
      }
      const roleData = await userService.addRole(role);
      return res.json(roleData)
    } catch (e) {
      next(e)
    }
  }

  async setUser(req, res, next) {
    try {
      const nameUser = req.body.nameUser
      const avatarUrl = req.file && req.file.filename ? req.file.filename : ""
      const {refreshToken} = req.cookies;
      const userDataSet = await userService.setUser(refreshToken, nameUser, avatarUrl);

      return res.json(userDataSet)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController();
