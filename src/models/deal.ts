"use strict";
import { Model } from "sequelize";

interface DealAttributes {
  id: number;
  user_id: number;
  company_name: string;
  deal_value_estimation: number;
  description: string;
  funnel_id: number;
  lead_id: number;
  logo: number;
  name: number;
  order: number;
  status_id: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Deal extends Model<DealAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    user_id: number;
    company_name: string;
    deal_value_estimation: number;
    description: string;
    funnel_id: number;
    lead_id: number;
    logo: number;
    name: number;
    order: number;
    status_id: number;

    static associate(models: any) {
      // define association here
      Deal.belongsToMany(models.User, { through: "User_Deal" });
      Deal.hasMany(models.Funnel, { foreignKey: "deal_id" });
    }
  }
  Deal.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: DataTypes.INTEGER,
      company_name: DataTypes.STRING,
      deal_value_estimation: DataTypes.INTEGER,
      description: DataTypes.STRING,
      funnel_id: DataTypes.INTEGER,
      lead_id: DataTypes.INTEGER,
      logo: DataTypes.STRING,
      name: DataTypes.STRING,
      order: DataTypes.INTEGER,
      status_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Deal",
    }
  );
  return Deal;
};
