const users = [];

exports.addUser = ({ id, username, chatroom }) => {
  username = username.trim().toLowerCase();
  chatroom = chatroom.trim().toLowerCase();

  // Validate Data
  if (!username || !chatroom) {
    return {
      error: "Username and room are required"
    };
  }

  // Check if user is exist
  const existUser = users.find(user => {
    const result = user.chatroom === chatroom && user.username === username;
    return result;
  });

  // Validate Username
  if (existUser) {
    return {
      error: "Username is in use"
    };
  }

  // Store User
  const user = { id, username, chatroom };
  users.push(user);
  return { user };
};

exports.removeUser = id => {
  const index = users.findIndex(user => {
    const result = user.id === id;
    return result;
  });

  if (index != -1) {
    return users.splice(index, 1)[0];
  }
};

exports.getUser = id => {
  return users.find(user => user.id === id);
};

exports.getUsersInRoom = chatroom => {
  return users.filter(user => user.chatroom === chatroom);
}
