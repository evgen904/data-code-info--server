const UserModel = require('../models/user-model')
const RoleModel = require('../models/role-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service.js')
const UserDto = require('../dtos/user-dtos')
const ApiError = require('../exceptions/api-error')

class UserService {
  async registration(email, password, login) {
    if (!login) {
      throw ApiError.BadRequest(`Логин не указан `)
    }
    const candidate = await UserModel.findOne({email})
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже сущетсвует`)
    }
    const candidateLogin = await UserModel.findOne({login})
    if (candidateLogin) {
      throw ApiError.BadRequest(`Пользователь с логином ${login} уже сущетсвует`)
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuid.v4()
    const userRole = await RoleModel.findOne({value: 'USER'})
    const user = await UserModel.create({email, login, password: hashPassword, activationLink, roles: [userRole.value]})
    await mailService.sendActivationmail(email, `${process.env.API_URL}api/activate/${activationLink}`)

    const userDto = new UserDto(user); // id, email, isActivated, roles
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  async activationmail(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const user = await UserModel.findOne({email: userData.email})

    await mailService.sendActivationmail(userData.email, `${process.env.API_URL}api/activate/${user.activationLink}`)
    return { userData }
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({activationLink})
    if (!user) {
      throw ApiError.BadRequest('Некоректная ссылка активации')
    }
    user.isActivated = true
    user.save()
  }

  async login (login, password) {
    const user = await UserModel.findOne({login})
    if (!user) {
      throw ApiError.BadRequest(`Пользователь ${login} не был найден`)
    }
    const isPassEquals = await bcrypt.compare(password, user.password)
    if(!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль')
    }
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({...userDto})

    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, user: userDto }
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }

    const user = await UserModel.findById(userData.id)
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({...userDto})

    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, user: userDto }
  }

  async getAllUsers() {
    const user = UserModel.find();
    return user;
  }

  async addRole(role) {
    const isRole = await RoleModel.findOne({value: role})
    if (isRole) {
      throw ApiError.BadRequest(`Роль ${role} уже создана`)
    }
    const roleData = await RoleModel.create({value: role})
    return { roleData }
  }

  async setUser(refreshToken, nameUser, avatarUrl) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);

    const userDataFind = await UserModel.findOne({email: userData.email});
    if (!userDataFind) {
      throw ApiError.BadRequest(`Пользователя ${userDataFind.email} нет в списке`)
    }
    const updateUser = {}
    if (nameUser) {
      updateUser.nameUser = nameUser
    }
    if (avatarUrl) {
      updateUser.avatarUrl = avatarUrl
    }

    const userDataSet = await userDataFind.updateOne(updateUser)
    return { userDataSet }
  }
}

module.exports = new UserService()
