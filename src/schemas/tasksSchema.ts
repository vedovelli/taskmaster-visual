import { z } from "zod";

// Schema para validação de status das tarefas
export const StatusSchema = z.enum([
  "done",
  "in-progress",
  "pending",
  "blocked",
]);

// Schema para validação de prioridades
export const PrioritySchema = z.enum(["high", "medium", "low"]);

// Schema para validação de IDs de subtarefa (formato: '1.1', '2.3', etc.)
export const SubtaskIdSchema = z.string().regex(/^\d+\.\d+$/, {
  message: "Subtask ID must be in format 'number.number' (e.g., '1.1', '2.3')",
});

// Schema para validação de IDs simples de tarefa (formato: '1', '2', etc.)
export const TaskIdSchema = z.string().regex(/^\d+$/, {
  message: "Task ID must be a simple number (e.g., '1', '2', '3')",
});

// Schema para validação de dependências (podem ser IDs de tarefas ou subtarefas)
export const DependencySchema = z.union([TaskIdSchema, SubtaskIdSchema]);

// Schema para validação de subtarefas
export const SubtaskSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, "Title cannot be empty"),
  description: z.string().min(1, "Description cannot be empty"),
  status: StatusSchema,
  priority: PrioritySchema.optional(),
  dependencies: z.array(DependencySchema).default([]),
  details: z.string().default(""),
  testStrategy: z.string().default(""),
});

// Schema para validação de tarefas principais (herda de subtask + array de subtasks)
export const TaskSchema = z
  .object({
    id: z.number().int().positive(),
    title: z.string().min(1, "Title cannot be empty"),
    description: z.string().min(1, "Description cannot be empty"),
    status: StatusSchema,
    priority: PrioritySchema.optional(),
    dependencies: z.array(DependencySchema).default([]),
    details: z.string().default(""),
    testStrategy: z.string().default(""),
    subtasks: z.array(SubtaskSchema).default([]),
  })
  .superRefine((task, ctx) => {
    // Validação customizada para garantir estrutura hierárquica correta
    task.subtasks.forEach((subtask, index) => {
      // Validar que subtasks têm IDs no formato correto relacionado ao parent
      const expectedPrefix = `${task.id}.`;
      const subtaskIdStr = `${task.id}.${subtask.id}`;

      if (!subtaskIdStr.startsWith(expectedPrefix)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Subtask ID ${subtask.id} should belong to task ${task.id}`,
          path: ["subtasks", index, "id"],
        });
      }

      // Validar dependências das subtasks
      subtask.dependencies.forEach((dep, depIndex) => {
        // Dependências podem ser de outras tarefas ou subtarefas válidas
        if (typeof dep === "string" && dep.includes(".")) {
          // É uma subtask dependency - validar formato
          if (!SubtaskIdSchema.safeParse(dep).success) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Invalid subtask dependency format: ${dep}`,
              path: ["subtasks", index, "dependencies", depIndex],
            });
          }
        } else {
          // É uma task dependency - validar formato
          if (!TaskIdSchema.safeParse(dep).success) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Invalid task dependency format: ${dep}`,
              path: ["subtasks", index, "dependencies", depIndex],
            });
          }
        }
      });
    });
  });

// Schema para validação de metadados de tags
export const TagMetadataSchema = z.object({
  description: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  author: z.string().optional(),
  version: z.string().optional(),
});

// Schema para validação de estrutura de tags
export const TagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name cannot be empty")
    .regex(/^[a-zA-Z0-9\-_]+$/, {
      message:
        "Tag name must contain only alphanumeric characters, hyphens, and underscores",
    }),
  tasks: z.array(TaskSchema).default([]),
  metadata: TagMetadataSchema.optional(),
  isActive: z.boolean().default(false),
});
