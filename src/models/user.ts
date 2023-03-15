"use strict";
import { Model } from "sequelize";

export default interface UserAttributes {
  id: number;
  full_name: string;
  is_admin: boolean;
  email: string;
  password: string;
  refresh_token: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    full_name: string;
    is_admin: boolean;
    email!: string;
    password!: string;
    refresh_token: string;

    static associate(models: any) {
      // define association here
      User.belongsToMany(models.Deal, { through: "User_Deal" });
      User.belongsToMany(models.Funnel, { through: "Funnel_User" });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      full_name: DataTypes.STRING,
      is_admin: DataTypes.BOOLEAN,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.STRING(1200),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["password"],
        },
      },
      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
      },
    }
  );
  return User;
};
