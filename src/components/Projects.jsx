import { useEffect, useState } from 'react';
import { BookOpenText, CodeXml, ExternalLink, Star } from 'lucide-react';
import '../styles/Projects.css';

const GITHUB_API = 'https://api.github.com';
const GITHUB_USER = 'Juan-Moralez';
const FEATURED_REPOSITORIES = new Set([
  'Juan-Moralez/programacion4Final',
  'Juan-Moralez/FinalProgramacion5',
  'DanielUrielMarquez/TallerCairoAutomotriz',
]);
const ADDITIONAL_REPOSITORIES = [
  {
    full_name: 'DanielUrielMarquez/TallerCairoAutomotriz',
    name: 'TallerCairoAutomotriz',
    description: '',
    html_url: 'https://github.com/DanielUrielMarquez/TallerCairoAutomotriz',
    language: 'JavaScript',
    stargazers_count: 0,
    updated_at: '2026-03-08T23:08:57Z',
    default_branch: 'main',
    fork: false,
    archived: false,
  },
];
const FALLBACK_REPOSITORIES = [
  {
    full_name: 'Juan-Moralez/FInalProgramacion3',
    name: 'FInalProgramacion3',
    description:
      'Final de la materia programación 3: sistema de gestión de reservas aéreas para Andes Air.',
    html_url: 'https://github.com/Juan-Moralez/FInalProgramacion3',
    language: 'Java',
    stargazers_count: 0,
    updated_at: '2026-11-23T21:53:21Z',
    default_branch: 'main',
    fork: false,
    archived: false,
  },
  {
    full_name: 'Juan-Moralez/juan-moralez.github.io',
    name: 'juan-moralez.github.io',
    description: 'Porfolio Personal',
    html_url: 'https://github.com/Juan-Moralez/juan-moralez.github.io',
    language: 'CSS',
    stargazers_count: 0,
    updated_at: '2026-11-22T19:05:55Z',
    default_branch: 'main',
    fork: false,
    archived: false,
  },
  {
    full_name: 'Juan-Moralez/FinalProgramacion5',
    name: 'FinalProgramacion5',
    description:
      'Aplicación web SPA desarrollada con Angular para consultar países y gestionar viajes y favoritos.',
    html_url: 'https://github.com/Juan-Moralez/FinalProgramacion5',
    language: 'TypeScript',
    stargazers_count: 0,
    updated_at: '2026-11-23T22:02:43Z',
    default_branch: 'main',
    fork: false,
    archived: false,
  },
  {
    full_name: 'Juan-Moralez/programacion4Final',
    name: 'programacion4Final',
    description:
      'Aplicación web para la gestión y venta online de mangas.',
    html_url: 'https://github.com/Juan-Moralez/programacion4Final',
    language: 'PHP',
    stargazers_count: 0,
    updated_at: '2026-11-23T22:09:37Z',
    default_branch: 'main',
    fork: false,
    archived: false,
  },
  ...ADDITIONAL_REPOSITORIES,
];
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
    /(^|\/)(docs?|documentacion|documentation|DOCUMENTACION)\//i.test(path);
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
  let ownRepositories;

  try {
    ownRepositories = await fetchGitHubJson(
      `/users/${GITHUB_USER}/repos?type=owner&per_page=100&sort=updated`,
    );
  } catch (error) {
    return {
      projects: FALLBACK_REPOSITORIES.map((repository) => ({
        ...repository,
        documentation: [],
        documentationError: true,
      })),
      warning: `No se pudieron consultar los repositorios en GitHub: ${error.message} Se muestra una lista local mientras tanto.`,
    };
  }

  const repositoriesByName = new Map(
    [...ownRepositories, ...ADDITIONAL_REPOSITORIES]
      .filter((repository) => !repository.fork && !repository.archived)
      .map((repository) => [repository.full_name, repository]),
  );

  const projects = await Promise.all(
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

  return { projects, warning: '' };
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    loadProjects()
      .then((result) => {
        if (active) {
          setProjects(result.projects);
          setWarning(result.warning);
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

  function retryProjects() {
    projectsRequest = undefined;
    setLoading(true);
    setError('');
    setWarning('');
    setAttempt((currentAttempt) => currentAttempt + 1);
  }

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
            onClick={retryProjects}
            type="button"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && warning && (
        <div className="projects-message" role="status">
          <p>{warning}</p>
          <button
            className="projects-retry"
            onClick={retryProjects}
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
