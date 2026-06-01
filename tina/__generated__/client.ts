import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ cacheDir: '/Users/yvesnicole/Dev/AccorsEnValromey/tina/__generated__/.cache/1780328546075', url: process.env.TINA_LOCAL_URL || 'https://content.tinajs.io/2.4/content/406dd4fa-a226-4261-a62a-82c3f213d9cc/github/main', token: '56c01cd4a1e197012b92fbce278028a4df39343f', queries,  });
export default client;
  