import { useEffect, useState } from 'react';
import { BookOpenText, CodeXml, ExternalLink, Star } from 'lucide-react';
import '../styles/Projects.css';

const GITHUB_API = 'https://api.github.com';
const GITHUB_USER = 'Juan-Moralez';
const FEATURED_REPOSITORIES = new Set([
  'Juan-Moralez/programacion4Final',
  'Juan-Moralez/ParcialProgramacion',
  'DanielUrielMarquez/TallerCairoAutomotriz',
]);
const ADDITIONAL_REPOSITORIES = ['DanielUrielMarquez/TallerCairoAutomotriz'];
let projectsRequest;

async function fetchGitHubJson(path) {
  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });

  if (!response.ok) {
    throw new Error(`GitHub respondió con el estado ${response.status}.`);
  }

  return response.json();
}

function isDocumentationFile(path) {
  const fileName = path.split('/').pop();
  const inDocumentationFolder =
    /(^|\/)(docs?|documentacion|documentation)\//i.test(path);
  const isReadme = /^readme(?:\.[^/]+)?$/i.test(fileName);
  const isDocument = /\.(md|pdf|txt|docx?)$/i.test(fileName);

  return isReadme || (inDocumentationFolder && isDocument);
}

function getDocumentationUrl(repository, path) {
  const branch = repository.default_branch
    .split('/')
    .map(encodeURIComponent)
    .join('/');
  const filePath = path.split('/').map(encodeURIComponent).join('/');

  return `${repository.html_url}/blob/${branch}/${filePath}`;
}

function loadProjects() {
  if (!projectsRequest) {
    projectsRequest = fetchProjects().catch((error) => {
      projectsRequest = undefined;
      throw error;
    });
  }

  return projectsRequest;
}

async function fetchProjects() {
  const ownRepositories = await fetchGitHubJson(
    `/users/${GITHUB_USER}/repos?type=owner&per_page=100&sort=updated`,
  );
  const additionalRepositories = await Promise.all(
    ADDITIONAL_REPOSITORIES.map((fullName) =>
      fetchGitHubJson(`/repos/${fullName}`),
    ),
  );
  const repositoriesByName = new Map(
    [...ownRepositories, ...additionalRepositories]
      .filter((repository) => !repository.fork && !repository.archived)
      .map((repository) => [repository.full_name, repository]),
  );

  return Promise.all(
    [...repositoriesByName.values()]
      .sort((first, second) => {
        const firstFeatured = FEATURED_REPOSITORIES.has(first.full_name);
        const secondFeatured = FEATURED_REPOSITORIES.has(second.full_name);

        if (firstFeatured !== secondFeatured) {
          return Number(secondFeatured) - Number(firstFeatured);
        }

        return new Date(second.updated_at) - new Date(first.updated_at);
      })
      .map(async (repository) => {
        try {
          const tree = await fetchGitHubJson(
            `/repos/${repository.full_name}/git/trees/${encodeURIComponent(repository.default_branch)}?recursive=1`,
          );
          const documentation = tree.tree
            .filter(
              (entry) =>
                entry.type === 'blob' && isDocumentationFile(entry.path),
            )
            .map((entry) => ({
              path: entry.path,
              url: getDocumentationUrl(repository, entry.path),
            }));

          return { ...repository, documentation };
        } catch (error) {
          return {
            ...repository,
            documentation: [],
            documentationError: error.message,
          };
        }
      }),
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    loadProjects()
      .then((loadedProjects) => {
        if (active) {
          setProjects(loadedProjects);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(`No se pudieron cargar los proyectos: ${loadError.message}`);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [attempt]);

  return (
    <section
      className="projects container"
      id="projects"
      aria-labelledby="projects-title"
    >
      <div className="projects-heading">
        <p className="projects-eyebrow">Lo que he creado</p>
        <h2 id="projects-title">Proyectos</h2>
        <p className="projects-intro">
          Repositorios públicos de GitHub, con acceso al código y a la
          documentación disponible.
        </p>
      </div>

      {loading && (
        <p className="projects-message" role="status">
          Cargando proyectos desde GitHub...
        </p>
      )}

      {error && (
        <div className="projects-message projects-error" role="alert">
          <p>{error}</p>
          <button
            className="projects-retry"
            onClick={() => {
              setLoading(true);
              setError('');
              setAttempt((currentAttempt) => currentAttempt + 1);
            }}
            type="button"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="projects-message">No se encontraron proyectos públicos.</p>
      )}

      {!loading && projects.length > 0 && (
        <div className="projects-grid">
          {projects.map((project) => {
            const featured = FEATURED_REPOSITORIES.has(project.full_name);

            return (
              <article className="project-card" key={project.full_name}>
                <div className="project-card-heading">
                  <CodeXml size={22} aria-hidden="true" />
                  {featured && (
                    <span className="project-featured">
                      <Star size={14} aria-hidden="true" />
                      Destacado
                    </span>
                  )}
                </div>

                <h3>{project.name}</h3>
                <p className="project-description">
                  {project.description ||
                    'Repositorio público disponible en GitHub.'}
                </p>

                <div className="project-meta">
                  {project.language && (
                    <span className="project-language">{project.language}</span>
                  )}
                  <span>{project.stargazers_count} estrellas</span>
                </div>

                <div className="project-documentation">
                  <h4>
                    <BookOpenText size={17} aria-hidden="true" />
                    Documentación
                  </h4>

                  {project.documentationError ? (
                    <p className="project-docs-empty">
                      No se pudo consultar la documentación de este repositorio.
                    </p>
                  ) : project.documentation.length > 0 ? (
                    <ul>
                      {project.documentation.map((document) => (
                        <li key={document.path}>
                          <a
                            href={document.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {document.path}
                            <ExternalLink size={14} aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="project-docs-empty">
                      No encontramos README ni archivos de documentación.
                    </p>
                  )}
                </div>

                <a
                  className="project-repository-link"
                  href={project.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <CodeXml size={16} aria-hidden="true" />
                  Ver repositorio
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>
      )}

      <a
        className="projects-all-link"
        href={`https://github.com/${GITHUB_USER}?tab=repositories`}
        target="_blank"
        rel="noreferrer"
      >
        Ver todos mis repositorios
        <ExternalLink size={16} aria-hidden="true" />
      </a>
    </section>
  );
}

export default Projects;
