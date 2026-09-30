import profile from './profile.js';
import projects from './projects.js';

// English overrides for the site data: profile parts plus the project entries, merged onto the Spanish base by index.
export default { ...profile, opensource: projects };
