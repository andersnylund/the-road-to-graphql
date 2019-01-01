import uuidv4 from 'uuid/v4';

export default {
  Query: {
    messages: (parent, args, { models }) => Object.values(models.messages),
    message: (parent, { id }, { models }) => models.messages[id],
  },

  Mutation: {
    createMessage: (parent, { text }, { me, models }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };

      models.messages[id] = message;
      models.users[me.id].messageIds.push(id);

      return message;
    },

    deleteMessage: (parent, { id }, { models }) => {
      const message = models.messages[id];
      if (!message) {
        return false;
      }
      delete models.messages[id];
      models.users[message.userId].messageIds = models.users[
        message.userId
      ].messageIds.filter(messageId => messageId !== id);
      return true;
    },
  },

  Message: {
    user: (message, args, { models }) => models.users[message.userId],
  },
};
