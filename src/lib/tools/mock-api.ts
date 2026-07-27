import { about, education, experience, expertise, site } from "@/lib/content";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type MockRequest = {
  method: HttpMethod;
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export type MockResponse = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  latencyMs: number;
};

export type CollectionRequest = {
  id: string;
  name: string;
  method: HttpMethod;
  path: string;
  description: string;
  body?: unknown;
};

export const portfolioCollection: CollectionRequest[] = [
  {
    id: "get-health",
    name: "Health check",
    method: "GET",
    path: "/api/health",
    description: "Verifies the portfolio API simulation is online.",
  },
  {
    id: "get-profile",
    name: "Get profile",
    method: "GET",
    path: "/api/profile",
    description: "Returns hero/profile data rendered on the homepage.",
  },
  {
    id: "get-experience",
    name: "List experience",
    method: "GET",
    path: "/api/experience",
    description: "Returns the professional experience timeline.",
  },
  {
    id: "get-experience-current",
    name: "Get current role",
    method: "GET",
    path: "/api/experience/current",
    description: "Returns only the current NICE CXone role.",
  },
  {
    id: "get-expertise",
    name: "List expertise areas",
    method: "GET",
    path: "/api/expertise",
    description: "Returns strategic expertise cards and tags.",
  },
  {
    id: "get-skills",
    name: "List skills",
    method: "GET",
    path: "/api/skills",
    description: "Returns skills and language competencies.",
  },
  {
    id: "get-education",
    name: "Get education",
    method: "GET",
    path: "/api/education",
    description: "Returns CATEC education details and focus areas.",
  },
  {
    id: "post-contact",
    name: "Submit contact message",
    method: "POST",
    path: "/api/contact",
    description: "Simulates the contact form payload used by Let's connect.",
    body: {
      name: "Hiring Manager",
      email: "hiring@example.com",
      message: "Interested in a QA Lead conversation.",
    },
  },
  {
    id: "get-metrics",
    name: "Get portfolio metrics",
    method: "GET",
    path: "/api/metrics",
    description: "Returns the metrics shown in the hero terminal panel.",
  },
];

function ok(body: unknown, latencyMs = 40 + Math.round(Math.random() * 90)): MockResponse {
  return {
    status: 200,
    statusText: "OK",
    headers: {
      "content-type": "application/json",
      "x-portfolio-mock": "true",
      "x-powered-by": "portfolio-api-sim",
    },
    body,
    latencyMs,
  };
}

function created(body: unknown): MockResponse {
  return {
    status: 201,
    statusText: "Created",
    headers: {
      "content-type": "application/json",
      "x-portfolio-mock": "true",
    },
    body,
    latencyMs: 55 + Math.round(Math.random() * 80),
  };
}

function notFound(path: string): MockResponse {
  return {
    status: 404,
    statusText: "Not Found",
    headers: { "content-type": "application/json" },
    body: { error: `No mock route for ${path}` },
    latencyMs: 20,
  };
}

function badRequest(message: string): MockResponse {
  return {
    status: 400,
    statusText: "Bad Request",
    headers: { "content-type": "application/json" },
    body: { error: message },
    latencyMs: 25,
  };
}

export async function executeMockApi(request: MockRequest): Promise<MockResponse> {
  const path = request.path.replace(/\/$/, "") || "/";
  const started = performance.now();

  let response: MockResponse;

  switch (`${request.method} ${path}`) {
    case "GET /api/health":
      response = ok({
        status: "healthy",
        service: "cristhian-alcocer-portfolio-api",
        timestamp: new Date().toISOString(),
      });
      break;
    case "GET /api/profile":
      response = ok({
        name: site.name,
        fullName: site.fullName,
        role: site.role,
        headline: site.headline,
        location: site.location,
        tagline: site.tagline,
        summary: site.summary,
        intro: site.intro,
        openToWork: site.openToWork,
        links: {
          email: site.email,
          whatsapp: site.phoneHref,
          linkedin: site.linkedin,
        },
      });
      break;
    case "GET /api/experience":
      response = ok({
        count: experience.roles.length,
        roles: experience.roles,
      });
      break;
    case "GET /api/experience/current":
      response = ok(experience.roles.find((role) => role.current) ?? null);
      break;
    case "GET /api/expertise":
      response = ok({
        title: expertise.title,
        areas: expertise.areas,
      });
      break;
    case "GET /api/skills":
      response = ok({
        skills: education.skills,
        languages: education.languages,
      });
      break;
    case "GET /api/education":
      response = ok(education.degree);
      break;
    case "GET /api/metrics":
      response = ok({
        yearsInQa: 7,
        leadershipRoles: 4,
        mappedSkills: education.skills.length,
        aboutFocus: about.philosophyTitle,
      });
      break;
    case "POST /api/contact": {
      const body = (request.body ?? {}) as {
        name?: string;
        email?: string;
        message?: string;
      };
      if (!body.name || !body.email || !body.message) {
        response = badRequest("name, email and message are required");
        break;
      }
      response = created({
        id: `msg_${Date.now()}`,
        receivedAt: new Date().toISOString(),
        delivery: "mailto-simulated",
        to: site.email,
        payload: body,
        nextStep: `mailto:${site.email}`,
      });
      break;
    }
    default:
      response = notFound(`${request.method} ${path}`);
  }

  const wait = Math.max(0, response.latencyMs - (performance.now() - started));
  await new Promise((resolve) => setTimeout(resolve, wait));
  return response;
}
