import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '56c01cd4a1e197012b92fbce278028a4df39343f', queries,  });
export default client;
  