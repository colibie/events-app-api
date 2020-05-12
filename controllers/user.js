const User = require('../data/user');

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};

/**
 * @api {get} /users/:id Get User by id
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiUse Authentication
 * @apiParam {String} id id of User to retrieve
 * @apiUse PopulateQueryParam
 * @apiUse ModelUser
 */
async function getUser(req, res) {
  try {
    const id = req.swagger.params.id.value;

    const anyPermission = req.access.can(req.role).readAny('User');
    const ownPermission = req.access.can(req.role).readOwn('User');

    const User = await User.getUser(id, req.query);
    if (!User) return res.status(404).json({ message: 'User not found' });

    if (anyPermission.granted) {
      res.permission = anyPermission;
      return res.json(User);
    }

    if (ownPermission.granted && await req.helpers.hasUser(req.user.id, id)) {
      res.permission = ownPermission;
      return res.json(User);
    }

    return res.status(403).json({ message: 'operation not allowed' });
  } catch (error) {
    return res.status(error.message ? 400 : 500).json({ message: error.message || 'failed to fetch User' });
  }
}

/**
 * @api {get} /users Get all Users
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiUse Authentication
 * @apiUse ListQueryParams
 * @apiUse ModelQueryUser
 * @apiUse OtherModelParams
 * @apiUse ModelUsers
 */
async function getUsers(req, res) {
  try {
    const readAnyPermission = req.access.can(req.role).readAny('User');
    const ownPermission = req.access.can(req.role).readOwn('User');

    if (readAnyPermission.granted) {
      const Users = await User.getUsers(req.query);
      res.permission = readAnyPermission;
      return res.json(Users);
    }

    if (ownPermission.granted) {
      const UserIDs = await req.helpers.UserIdList(req.user.id, req.query);
      const Users = await User.getUsers({ ...req.query, _id: { $in: UserIDs } });
      res.permission = ownPermission;
      return res.json(Users);
    }

    return res.status('403').json({ message: 'operation not allowed' });
  } catch (error) {
    console.log(error);
    return res.status(error.message ? 400 : 500).json({ message: error.message || 'failed to fetch Users' });
  }
}

/**
 * @api {post} /users Create new User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiUse Authentication
 * @apiUse ModelCreateUser
 * @apiUse ModelUser
 */
async function createUser(req, res) {
  try {
    const createAnyPermission = req.access.can(req.role).createAny('User');
    const createOwnPermission = req.access.can(req.role).createOwn('User');

    let data = {};

    if (createAnyPermission.granted) {
      data = createAnyPermission.filter(req.body);
    } else if (
      createOwnPermission.granted
      && req.user.id === req.body.user
    ) {
      data = createOwnPermission.filter(req.body);
    } else {
      return res.status(403).json({ message: 'operation not allowed' });
    }

    const User = await User.createUser(data);
    return res.json(User);
  } catch (error) {
    console.log(error);
    return res.status(error.message ? 400 : 500).json({ message: error.message || 'failed to create User' });
  }
}

/**
 * @api {put} /users/:id Update User by id
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiUse Authentication
 * @apiParam {String} id id of User to update
 * @apiUse ModelUpdateUser
 * @apiUse ModelUser
 */
async function updateUser(req, res) {
  try {
    const id = req.swagger.params.id.value;

    const updateAnyPermission = req.access.can(req.role).updateAny('User');
    const updateOwnPermission = req.access.can(req.role).updateOwn('User');

    let data = {};

    let user = await User.getUser(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (updateAnyPermission.granted) {
      data = updateAnyPermission.filter(req.body);
    } else if (
      updateOwnPermission.granted
      && req.user.id === String(User.user)
    ) {
      data = updateOwnPermission.filter(req.body);
    } else {
      return res.status(403).json({ message: 'operation not allowed' });
    }

    user = await User.updateUser(id, data);
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(error.message ? 400 : 500).json({ message: error.message || 'failed to update User' });
  }
}

/**
 * @api {delete} /users/:id Delete User by id
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiUse Authentication
 * @apiParam {String} id id of User to delete
 * @apiUse PopulateQueryParam
 * @apiUse ModelUser
 */
async function deleteUser(req, res) {
  try {
    const id = req.swagger.params.id.value;

    const anyPermission = req.access.can(req.role).readAny('User');
    const ownPermission = req.access.can(req.role).readOwn('User');

    const User = await User.deleteUser(id);
    if (!User) return res.status(404).json({ message: 'User not found' });

    if (anyPermission.granted) {
      res.permission = anyPermission;
      return res.json(User);
    }

    if (ownPermission.granted && await req.helpers.hasUser(req.user.id, id)) {
      res.permission = ownPermission;
      return res.json(User);
    }

    return res.status(403).json({ message: 'operation not allowed' });
  } catch (error) {
    return res.status(error.message ? 400 : 500).json({ message: error.message || 'failed to fetch User' });
  }
}