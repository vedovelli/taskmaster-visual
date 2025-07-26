import {
  AppConfigSchema,
  ProjectMetadataSchema,
  SessionStateSchema,
  StateSchema,
  UserPreferencesSchema,
} from "../schemas/stateSchema";
import {
  DependencySchema,
  PrioritySchema,
  StatusSchema,
  SubtaskIdSchema,
  SubtaskSchema,
  TagMetadataSchema,
  TagSchema,
  TaskIdSchema,
  TaskSchema,
} from "../schemas/tasksSchema";

import { z } from "zod";

// Tipos básicos derivados dos schemas
export type Status = z.infer<typeof StatusSchema>;
export type Priority = z.infer<typeof PrioritySchema>;
export type SubtaskId = z.infer<typeof SubtaskIdSchema>;
export type TaskId = z.infer<typeof TaskIdSchema>;
export type Dependency = z.infer<typeof DependencySchema>;

// Tipos principais para tarefas
export type Subtask = z.infer<typeof SubtaskSchema>;
export type Task = z.infer<typeof TaskSchema>;

// Tipos para estrutura de tags
export type TagMetadata = z.infer<typeof TagMetadataSchema>;
export type Tag = z.infer<typeof TagSchema>;

// Tipos para configuração e estado da aplicação
export type AppConfig = z.infer<typeof AppConfigSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type SessionState = z.infer<typeof SessionStateSchema>;
export type ProjectMetadata = z.infer<typeof ProjectMetadataSchema>;
export type State = z.infer<typeof StateSchema>;

// Schema principal para tasks.json que combina todos os schemas
export const TasksFileSchema = z
  .object({
    version: z.string().default("1.0.0"),
    projectMetadata: ProjectMetadataSchema.optional(),
    tags: z.record(z.string(), TagSchema).default({
      master: {
        name: "master",
        tasks: [],
        isActive: true,
      },
    }),
    currentTag: z.string().default("master"),
    migrationVersion: z.string().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  })
  .superRefine((file, ctx) => {
    // Validar que currentTag existe em tags
    if (!Object.keys(file.tags).includes(file.currentTag)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Current tag '${file.currentTag}' must exist in tags`,
        path: ["currentTag"],
      });
    }

    // Validar que existe pelo menos uma tag ativa
    const activeTags = Object.values(file.tags).filter((tag) => tag.isActive);
    if (activeTags.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one tag must be active",
        path: ["tags"],
      });
    }

    // Validar que não há mais de uma tag ativa
    if (activeTags.length > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only one tag can be active at a time",
        path: ["tags"],
      });
    }

    // Validar consistência entre tags e IDs das tarefas
    Object.entries(file.tags).forEach(([tagName, tag]) => {
      tag.tasks.forEach((task, taskIndex) => {
        // Verificar se há duplicatas de ID dentro da tag
        const duplicateIds = tag.tasks.filter((t) => t.id === task.id);
        if (duplicateIds.length > 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate task ID ${task.id} found in tag '${tagName}'`,
            path: ["tags", tagName, "tasks", taskIndex, "id"],
          });
        }

        // Validar dependências das tarefas
        task.dependencies.forEach((dep, depIndex) => {
          // Dependências devem referenciar tarefas existentes na mesma tag ou outras tags
          const [depTaskId] = dep.toString().split(".");
          const depTaskExists = Object.values(file.tags).some((t) =>
            t.tasks.some((task) => task.id.toString() === depTaskId)
          );

          if (!depTaskExists) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Task dependency '${dep}' not found in any tag`,
              path: [
                "tags",
                tagName,
                "tasks",
                taskIndex,
                "dependencies",
                depIndex,
              ],
            });
          }
        });

        // Validar subtasks
        task.subtasks.forEach((subtask, subtaskIndex) => {
          subtask.dependencies.forEach((dep, depIndex) => {
            const [depTaskId] = dep.toString().split(".");
            const depExists = Object.values(file.tags).some((t) =>
              t.tasks.some((task) => task.id.toString() === depTaskId)
            );

            if (!depExists) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Subtask dependency '${dep}' not found in any tag`,
                path: [
                  "tags",
                  tagName,
                  "tasks",
                  taskIndex,
                  "subtasks",
                  subtaskIndex,
                  "dependencies",
                  depIndex,
                ],
              });
            }
          });
        });
      });
    });
  });

// Tipo para o arquivo tasks.json completo
export type TasksFile = z.infer<typeof TasksFileSchema>;

// Tipos auxiliares para operações comuns
export type CreateTaskInput = Omit<Task, "id" | "subtasks"> & {
  subtasks?: Omit<Subtask, "id">[];
};

export type CreateSubtaskInput = Omit<Subtask, "id">;

export type UpdateTaskInput = Partial<Omit<Task, "id" | "subtasks">> & {
  subtasks?: (Partial<Subtask> & { id: number })[];
};

export type UpdateSubtaskInput = Partial<Omit<Subtask, "id">>;

// Tipos para filtros e queries
export type TaskFilter = {
  status?: Status | Status[];
  priority?: Priority | Priority[];
  tag?: string | string[];
  hasSubtasks?: boolean;
  dependencies?: string | string[];
};

export type TaskSort = {
  field: "id" | "title" | "status" | "priority" | "createdAt";
  order: "asc" | "desc";
};

// Tipos para resultados de operações
export type OperationResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
};

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
};
