let data: any[] = [];

/**
 * @typedef User
 * @prop {string} username - username
 * @prop {string} password - password
 * @prop {Date} dateJoined - date user joined
 * @prop {string} id - user id
 */

/**
 * @class Users
 * 
 * Stores all Users. Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Users {
  /**
   * Add a User.
   * 
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @return {User} - the newly created user
   */
  static addOne(username: string, password: string) {
    const dateJoined = new Date();
    const id = String(data.length);
    const user = { username, password, dateJoined, id };
    data.push(user);
    return user;
  }

  /**
   * Find a user by userId.
   * 
   * @param {string} userId - The userId of the user to find
   * @return {User} - The user with the given id, if any
   */
  static findOneByUserId(userId: string) {
    return data.filter(user => user.id === userId)[0];
  }

  /**
   * Find a user by username.
   * 
   * @param {string} username - The username of the user to find
   * @return {User} - The user with the given username, if any
   */
  static findOneByUsername(username: string) {
    return data.filter(user => user.username === username)[0];
  }

  /**
   * Update user's information
   * 
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated credentials
   * @return {User | undefined} - The updated user
   */
  static updateOne(userId: string, userDetails: any) {
    const user = Users.findOneByUserId(userId);
    userDetails.password !== undefined && (user.password = userDetails.password);
    userDetails.username !== undefined && (user.username = userDetails.username);
    return user;
  }

  /**
   * Delete a user from the collection.
   * 
   * @param {string} userId - The userId of user to delete
   * @return {Boolean} - true if the user has been deleted, false otherwise
   */
  static deleteOne(userId: string) {
    const user = Users.findOneByUserId(userId);
    data = data.filter(user => user.userId !== userId);
    return user;
  }

  /**
   * Transform a raw User object from the database into an object
   * with all the information needed by the frontend
   * (in this case, removing the password for security)
   * 
   * @param {User} user - A user object
   * @returns - The user object without the password
   */
  static constructUserResponse(user: {username: string, dateJoined: Date, id: string}){
    const name = user.username;
    const date = user.dateJoined;
    const id = user.id;
    return { name, date, id };
  }
}

export default Users;