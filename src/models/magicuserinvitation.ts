"use strict";
import { Model } from "sequelize";

export interface MagicUserInvitationAttributes {
  id: string;
  invitee_email: string;
  token: string;
  accepted: boolean;
  funnel_id: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class MagicUserInvitation extends Model<MagicUserInvitationAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: string;
    invitee_email: string;
    token: string;
    accepted: boolean;
    funnel_id: number;
    static associate(models: any) {
      // define association here
      MagicUserInvitation.belongsTo(models.Funnel, { foreignKey: "funnel_id" });
    }
  }
  MagicUserInvitation.init(
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      invitee_email: DataTypes.STRING,
      token: DataTypes.STRING,
      accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      funnel_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MagicUserInvitation",
    }
  );
  return MagicUserInvitation;
};
