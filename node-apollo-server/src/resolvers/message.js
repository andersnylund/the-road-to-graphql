export default {
  Query: {
    messages: async (parent, args, { models }) => models.Message.findAll(),
    message: async (parent, { id }, { models }) => models.Message.findByPk(id),
  },

  Mutation: {
    createMessage: async (parent, { text }, { me, models }) => {
      return models.Message.create({
        text,
        userId: me.id,
      });
    },

    deleteMessage: async (parent, { id }, { models }) => {
      models.Message.destroy({ where: { id } });
    },
  },

  Message: {
    user: async (message, args, { models }) =>
      models.User.findByPk(message.userId),
  },
};
