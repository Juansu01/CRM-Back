import sessionAndRegistration from "./userSessionAndRegistration";
import refreshToken from "./refreshToken";
import funnelRouter from "./funnels";
import filterRouter from "./filter";
import leadsRouter from "./leads";
import dealsRouter from "./deals";
import stagesRouter from "./stages";
import magicUserInvitationRouter from "./acceptMagicUserInvitation";

export default [
  sessionAndRegistration,
  leadsRouter,
  funnelRouter,
  filterRouter,
  refreshToken,
  dealsRouter,
  stagesRouter,
  magicUserInvitationRouter,
];
