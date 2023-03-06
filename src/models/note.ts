"use strict";
import { Model } from "sequelize";

interface NoteAttributes {
  id: number;
  content: string;
  deal_id: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Note extends Model<NoteAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    content: string;
    deal_id: number;
    static associate(models: any) {
      // define association here
      Note.belongsTo(models.Deal, { foreignKey: "deal_id" });
    }
  }
  Note.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      content: DataTypes.STRING,
      deal_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Note",
    }
  );
  return Note;
};
