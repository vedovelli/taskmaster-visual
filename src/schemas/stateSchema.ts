import { z } from "zod";

// Schema para validação de configurações da aplicação
export const AppConfigSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  language: z.string().default("en"),
  autoSave: z.boolean().default(true),
  notifications: z.boolean().default(true),
  debugMode: z.boolean().default(false),
});

// Schema para validação de preferências do usuário
export const UserPreferencesSchema = z.object({
  defaultView: z.enum(["grid", "list", "kanban"]).default("grid"),
  itemsPerPage: z.number().int().min(5).max(100).default(20),
  showCompletedTasks: z.boolean().default(true),
  sortBy: z
    .enum(["id", "priority", "status", "title", "createdAt"])
    .default("id"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  groupBy: z.enum(["none", "status", "priority", "tag"]).default("none"),
});

// Schema para validação de estado da sessão
export const SessionStateSchema = z.object({
  lastActiveTask: z.string().optional(),
  lastActiveTag: z.string().default("master"),
  openTasks: z.array(z.string()).default([]),
  collapsedTasks: z.array(z.string()).default([]),
  searchQuery: z.string().default(""),
  activeFilters: z.record(z.string(), z.any()).default({}),
});

// Schema para validação de metadados do projeto
export const ProjectMetadataSchema = z.object({
  name: z.string().min(1, "Project name cannot be empty"),
  version: z.string().default("1.0.0"),
  description: z.string().optional(),
  author: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  tasksPath: z.string().default(".taskmaster/tasks/tasks.json"),
  configPath: z.string().default(".taskmaster/config.json"),
});

// Schema principal para validação de state.json
export const StateSchema = z
  .object({
    currentTag: z.string().default("master"),
    lastSwitched: z.string().datetime().optional(),
    migrationNoticeShown: z.boolean().default(false),
    appConfig: AppConfigSchema.default({}),
    userPreferences: UserPreferencesSchema.default({}),
    sessionState: SessionStateSchema.default({}),
    projectMetadata: ProjectMetadataSchema,
    availableTags: z.array(z.string()).default(["master"]),
    version: z.string().default("1.0.0"),
  })
  .superRefine((state, ctx) => {
    // Validar que currentTag existe em availableTags
    if (!state.availableTags.includes(state.currentTag)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Current tag '${state.currentTag}' must be in available tags`,
        path: ["currentTag"],
      });
    }

    // Validar que lastActiveTag existe em availableTags (se definido)
    if (
      state.sessionState.lastActiveTag &&
      !state.availableTags.includes(state.sessionState.lastActiveTag)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Last active tag '${state.sessionState.lastActiveTag}' must be in available tags`,
        path: ["sessionState", "lastActiveTag"],
      });
    }

    // Validar timestamps
    if (state.lastSwitched && state.projectMetadata.updatedAt) {
      const lastSwitched = new Date(state.lastSwitched);
      const updatedAt = new Date(state.projectMetadata.updatedAt);

      if (lastSwitched > updatedAt) {
        // lastSwitched não pode ser posterior a updatedAt
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Last switched time cannot be after project updated time",
          path: ["lastSwitched"],
        });
      }
    }
  });
