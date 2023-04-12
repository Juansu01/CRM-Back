import sessionAndRegistration from "./userSessionAndRegistration";
import refreshToken from "./refreshToken";
import funnelRouter from "./funnels";
import filterRouter from "./filter";
import leadsRouter from "./leads";
import dealsRouter from "./deals";
import notesRouter from "./notes";

export default [
  sessionAndRegistration,
  leadsRouter,
  notesRouter,
  funnelRouter,
  filterRouter,
  refreshToken,
  dealsRouter,
];
