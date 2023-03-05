"use strict";
import { Model } from "sequelize";

interface ModelAttributes {
  id: number;
  company: string;
  email: string;
  full_name: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Lead extends Model<ModelAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    company: string;
    email: string;
    full_name: string;
    static associate(models: any) {
      // define association here
      Lead.hasMany(models.Deal, { foreignKey: "lead_id" });
    }
  }
  Lead.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      company: DataTypes.STRING,
      email: DataTypes.STRING,
      full_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Lead",
    }
  );
  return Lead;
};
