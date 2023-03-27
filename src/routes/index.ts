import sessionAndRegistration from "./userSessionAndRegistration";
import refreshToken from "./refreshToken";
import funnelRouter from "./funnels";
import filterRouter from "./filter";
import leadsRouter from "./leads";
import dealsRouter from "./deals";

export default [
  sessionAndRegistration,
  leadsRouter,
  funnelRouter,
  filterRouter,
  refreshToken,
  dealsRouter,
];
