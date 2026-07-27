import { education, experience, expertise, site } from "@/lib/content";
import { jiraIssues } from "@/lib/tools/jira-data";

export type SqlRow = Record<string, string | number | boolean | null>;

export type SqlTable = {
  name: string;
  columns: string[];
  rows: SqlRow[];
};

function seedTables(): Record<string, SqlTable> {
  const experiences = experience.roles.map((role, index) => ({
    id: index + 1,
    company: role.company,
    title: role.title,
    period: role.period,
    employment: role.employment,
    current: role.current,
    summary: role.summary,
  }));

  const experience_highlights = experience.roles.flatMap((role, roleIndex) =>
    role.highlights.map((item, highlightIndex) => ({
      id: roleIndex * 100 + highlightIndex + 1,
      experience_id: roleIndex + 1,
      company: role.company,
      label: item.label,
      detail: item.text,
    })),
  );

  const expertise_areas = expertise.areas.map((area, index) => ({
    id: index + 1,
    slug: area.id,
    title: area.title,
    description: area.description,
    tags: area.tags.join(", "),
  }));

  const skills = education.skills.map((skill, index) => ({
    id: index + 1,
    name: skill,
    category: skill.includes("Claude") || skill.includes("Rovo")
      ? "AI"
      : skill.includes("Postman") || skill.includes("Playwright") || skill.includes("JMeter")
        ? "Tooling"
        : "Method",
  }));

  return {
    profiles: {
      name: "profiles",
      columns: [
        "id",
        "full_name",
        "role",
        "headline",
        "location",
        "email",
        "phone",
        "linkedin",
        "open_to_work",
      ],
      rows: [
        {
          id: 1,
          full_name: site.fullName,
          role: site.role,
          headline: site.headline,
          location: site.location,
          email: site.email,
          phone: site.phone,
          linkedin: site.linkedin,
          open_to_work: site.openToWork,
        },
      ],
    },
    experiences: {
      name: "experiences",
      columns: ["id", "company", "title", "period", "employment", "current", "summary"],
      rows: experiences,
    },
    experience_highlights: {
      name: "experience_highlights",
      columns: ["id", "experience_id", "company", "label", "detail"],
      rows: experience_highlights,
    },
    expertise_areas: {
      name: "expertise_areas",
      columns: ["id", "slug", "title", "description", "tags"],
      rows: expertise_areas,
    },
    skills: {
      name: "skills",
      columns: ["id", "name", "category"],
      rows: skills,
    },
    education: {
      name: "education",
      columns: ["id", "title", "field", "institution", "period"],
      rows: [
        {
          id: 1,
          title: education.degree.title,
          field: education.degree.field,
          institution: education.degree.institution,
          period: education.degree.period,
        },
      ],
    },
    contact_messages: {
      name: "contact_messages",
      columns: ["id", "name", "email", "message", "created_at"],
      rows: [
        {
          id: 1,
          name: "Hiring Manager",
          email: "hiring@example.com",
          message: "Interested in a QA Lead conversation.",
          created_at: "2026-07-20T15:00:00Z",
        },
      ],
    },
    jira_issues: {
      name: "jira_issues",
      columns: ["key", "type", "summary", "status", "priority", "parent", "assignee"],
      rows: jiraIssues.map((issue) => ({
        key: issue.key,
        type: issue.type,
        summary: issue.summary,
        status: issue.status,
        priority: issue.priority,
        parent: issue.parent ?? null,
        assignee: issue.assignee,
      })),
    },
  };
}

let db = seedTables();

export function listTables(): SqlTable[] {
  return Object.values(db);
}

export function resetDatabase() {
  db = seedTables();
}

export function getTable(name: string): SqlTable | undefined {
  return db[name.toLowerCase()];
}

export type QueryResult = {
  columns: string[];
  rows: SqlRow[];
  rowCount: number;
  message: string;
};

function normalizeIdent(value: string) {
  return value.replace(/["`\[\]]/g, "").trim().toLowerCase();
}

function compare(left: string | number | boolean | null, op: string, rightRaw: string) {
  const right = rightRaw.replace(/^'|'$/g, "").replace(/^"|"$/g, "");
  if (op === "IS" && right.toUpperCase() === "NULL") return left === null;
  if (op === "IS" && right.toUpperCase() === "NOT NULL") return left !== null;

  const leftNum = typeof left === "number" ? left : Number(left);
  const rightNum = Number(right);
  const bothNumeric = !Number.isNaN(leftNum) && !Number.isNaN(rightNum) && right !== "";

  switch (op) {
    case "=":
      if (bothNumeric) return leftNum === rightNum;
      return String(left).toLowerCase() === right.toLowerCase() || String(left) === right;
    case "!=":
    case "<>":
      if (bothNumeric) return leftNum !== rightNum;
      return String(left).toLowerCase() !== right.toLowerCase();
    case ">":
      return bothNumeric ? leftNum > rightNum : String(left) > right;
    case "<":
      return bothNumeric ? leftNum < rightNum : String(left) < right;
    case ">=":
      return bothNumeric ? leftNum >= rightNum : String(left) >= right;
    case "<=":
      return bothNumeric ? leftNum <= rightNum : String(left) <= right;
    case "LIKE":
      return likeMatches(String(left ?? ""), right);
    default:
      return false;
  }
}

/** Convert SQL LIKE to a safe RegExp (escape metacharacters; %/_ are wildcards). */
function likeMatches(value: string, pattern: string) {
  let source = "";
  for (const char of pattern) {
    if (char === "%") {
      source += ".*";
      continue;
    }
    if (char === "_") {
      source += ".";
      continue;
    }
    if (/[.*+?^${}()|[\]\\]/.test(char)) {
      source += `\\${char}`;
      continue;
    }
    source += char;
  }
  return new RegExp(`^${source}$`, "i").test(value);
}

function applyWhere(rows: SqlRow[], whereClause?: string) {
  if (!whereClause) return rows;
  const match = whereClause.match(
    /^([\w."`[\]]+)\s*(=|!=|<>|>=|<=|>|<|LIKE|IS)\s*(.+)$/i,
  );
  if (!match) {
    throw new Error("Unsupported WHERE clause. Try: column = value");
  }
  const [, columnRaw, op, valueRaw] = match;
  const column = normalizeIdent(columnRaw);
  return rows.filter((row) => {
    const key = Object.keys(row).find((item) => item.toLowerCase() === column);
    if (!key) return false;
    return compare(row[key], op.toUpperCase(), valueRaw.trim());
  });
}

function applyOrder(rows: SqlRow[], orderClause?: string) {
  if (!orderClause) return rows;
  const [columnRaw, directionRaw] = orderClause.split(/\s+/);
  const column = normalizeIdent(columnRaw);
  const direction = (directionRaw ?? "ASC").toUpperCase();
  return [...rows].sort((a, b) => {
    const key = Object.keys(a).find((item) => item.toLowerCase() === column);
    if (!key) return 0;
    const left = a[key];
    const right = b[key];
    if (left === right) return 0;
    if (left === null) return 1;
    if (right === null) return -1;
    if (left > right) return direction === "DESC" ? -1 : 1;
    return direction === "DESC" ? 1 : -1;
  });
}

export function runSql(sql: string): QueryResult {
  const cleaned = sql.replace(/;+\s*$/g, "").trim();
  if (!cleaned) {
    throw new Error("Empty query");
  }

  const showMatch = cleaned.match(/^SHOW\s+TABLES$/i);
  if (showMatch) {
    const rows = listTables().map((table) => ({ table_name: table.name, rows: table.rows.length }));
    return {
      columns: ["table_name", "rows"],
      rows,
      rowCount: rows.length,
      message: `${rows.length} table(s)`,
    };
  }

  const describeMatch = cleaned.match(/^DESCRIBE\s+([\w."`[\]]+)$/i);
  if (describeMatch) {
    const table = getTable(normalizeIdent(describeMatch[1]));
    if (!table) throw new Error(`Unknown table: ${describeMatch[1]}`);
    const rows = table.columns.map((column) => ({ column_name: column }));
    return {
      columns: ["column_name"],
      rows,
      rowCount: rows.length,
      message: `${table.name} (${rows.length} columns)`,
    };
  }

  const selectMatch = cleaned.match(
    /^SELECT\s+(.+?)\s+FROM\s+([\w."`[\]]+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?$/i,
  );
  if (!selectMatch) {
    throw new Error(
      "Supported: SELECT ... FROM table [WHERE ...] [ORDER BY ...] [LIMIT n], SHOW TABLES, DESCRIBE table",
    );
  }

  const [, selectPart, tableRaw, wherePart, orderPart, limitPart] = selectMatch;
  const table = getTable(normalizeIdent(tableRaw));
  if (!table) throw new Error(`Unknown table: ${tableRaw}`);

  let rows = applyOrder(applyWhere(table.rows, wherePart?.trim()), orderPart?.trim());
  if (limitPart) {
    rows = rows.slice(0, Number(limitPart));
  }

  const selected = selectPart.trim();
  let columns: string[];
  let projected: SqlRow[];

  if (selected === "*") {
    columns = table.columns;
    projected = rows.map((row) => {
      const next: SqlRow = {};
      for (const column of columns) next[column] = row[column] ?? null;
      return next;
    });
  } else {
    columns = selected.split(",").map((part) => normalizeIdent(part));
    projected = rows.map((row) => {
      const next: SqlRow = {};
      for (const column of columns) {
        const key = Object.keys(row).find((item) => item.toLowerCase() === column);
        next[column] = key ? row[key] : null;
      }
      return next;
    });
  }

  return {
    columns,
    rows: projected,
    rowCount: projected.length,
    message: `${projected.length} row(s) returned`,
  };
}

export const sampleQueries = [
  "SHOW TABLES;",
  "DESCRIBE experiences;",
  "SELECT full_name, role, location FROM profiles;",
  "SELECT company, title, period FROM experiences WHERE current = true;",
  "SELECT label, detail FROM experience_highlights WHERE company = 'NICE CXone' LIMIT 5;",
  "SELECT name, category FROM skills WHERE category = 'Tooling';",
  "SELECT key, type, status FROM jira_issues WHERE type = 'Test' ORDER BY key;",
  "SELECT title, institution, period FROM education;",
];
