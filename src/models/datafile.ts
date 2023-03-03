"use strict";
import { Model } from "sequelize";

interface DataFileAttributes {
  id: number;
  document_file: Blob;
  deal_id: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class DataFile extends Model<DataFileAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id: number;
    document_file: Blob;
    deal_id: number;
    static associate(models: any) {
      // define association here
      DataFile.belongsTo(models.Deal, { foreignKey: "deal_id" });
    }
  }
  DataFile.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      document_file: DataTypes.BLOB("long"),
      deal_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "DataFile",
    }
  );
  return DataFile;
};
