export default {
  Query: {
    users: async (parent, args, { models }) => models.User.findAll(),
    user: async (parent, { id }, { models }) => models.User.findById(id),
    me: async (parent, args, { models, me }) => models.User.findById(me.id),
  },

  User: {
    messages: async (user, args, { models }) =>
      models.Message.findAll({
        where: {
          userId: user.id,
        },
      }),
  },
};
