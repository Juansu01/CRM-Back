"use strict";
import { Model } from "sequelize";

interface StageAttributes {
  id: number;
  color: string;
  name: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Stage extends Model<StageAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    color: string;
    name: string;
    static associate(models: any) {
      // define association here
      Stage.belongsToMany(models.Funnel, { through: "Funnel_Stage" });
      Stage.belongsToMany(models.Deal, { through: "Deal_Stage" });
    }
  }
  Stage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      color: DataTypes.STRING,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Stage",
    }
  );
  return Stage;
};
