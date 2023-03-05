"use strict";
import { Model } from "sequelize";

interface StatusAttributes {
  id: number;
  case: string;
  color: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Status extends Model<StatusAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    case: string;
    color: string;
    static associate(models: any) {
      // define association here
      Status.belongsTo(models.Deal);
    }
  }
  Status.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      case: DataTypes.STRING,
      color: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Status",
    }
  );
  return Status;
};
