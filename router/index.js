const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const folderController = require('../controllers/folder-controller');
const postController = require('../controllers/post-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const roleMiddleware = require('../middlewares/role-middleware');

router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 3, max: 32}),
  userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

router.post('/role/add', authMiddleware, userController.roleAdd);

router.post('/folder/add/', authMiddleware, folderController.add);
router.post('/folder/remove/', authMiddleware, folderController.remove);
router.post('/folder/set/', authMiddleware, folderController.set);
router.get('/folder/getFoldersAll/', folderController.getFolders);
router.get('/folder/getFoldersUser/', roleMiddleware(['USER', 'ADMIN']), folderController.getFoldersUser);

router.post('/post/addPost/', authMiddleware, postController.add);
router.post('/post/remove/', authMiddleware, postController.remove);
router.post('/post/set/', authMiddleware, postController.set);
router.post('/post/edit/', authMiddleware, postController.edit);
router.post('/post/getPosts/', postController.getPosts);
router.post('/post/getPostsFolderUser/', authMiddleware, postController.getPostsFolderUser);
router.get('/post/getPostsModeration/', roleMiddleware(['ADMIN', 'MODERATOR']), postController.getPostsModeration);
router.post('/post/setPublishPost/', roleMiddleware(['ADMIN', 'MODERATOR']), postController.setPublishPost);
router.get('/post/getPostsUser/', postController.getPostsUser);

module.exports = router
