"use strict";
import { Model } from "sequelize";

interface MagicUserAttributes {
  id: number;
  email: string;
  link_opened: boolean;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class MagicUser extends Model<MagicUserAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    email: string;
    link_opened: boolean;
    static associate(models: any) {
      // define association here
    }
  }
  MagicUser.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email: DataTypes.STRING,
      link_opened: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "MagicUser",
    }
  );
  return MagicUser;
};
