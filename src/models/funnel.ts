"use strict";
import { Model } from "sequelize";

interface FunnelAttributes {
  id: number;
  name: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Funnel extends Model<FunnelAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    name: string;
    static associate(models: any) {
      // define association here
      Funnel.belongsTo(models.Deal);
    }
  }
  Funnel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Funnel",
    }
  );
  return Funnel;
};
