"use strict";
import { Model } from "sequelize";

export interface FunnelAttributes {
  id: number;
  name: string;
  deal_id: number;
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
    deal_id: number;
    static associate(models: any) {
      // define association here
      Funnel.belongsTo(models.Deal, { foreignKey: "deal_id" });
      Funnel.belongsToMany(models.User, { through: "Funnel_User" });
      Funnel.belongsToMany(models.Stage, { through: "Funnel_Stage" });
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
      deal_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Funnel",
    }
  );
  return Funnel;
};
