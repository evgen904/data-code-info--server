module.exports = class UseDto {
  email;
  id;
  isActivated;
  roles;
  avatarUrl;
  nameUser;

  constructor(model) {
    this.email = model.email;
    this.avatarUrl = model.avatarUrl;
    this.nameUser = model.nameUser;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.roles = model.roles;
  }
}
