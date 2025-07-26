import { describe, expect, it } from "vitest";

import { TasksFileSchema } from "../../../src/types/taskmaster";

describe("TaskMaster Types", () => {
  describe("TasksFileSchema", () => {
    const validTasksFile = {
      version: "1.0.0",
      projectMetadata: {
        name: "Test Project",
        version: "1.0.0",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        tasksPath: ".taskmaster/tasks/tasks.json",
        configPath: ".taskmaster/config.json",
      },
      tags: {
        master: {
          name: "master",
          tasks: [
            {
              id: 1,
              title: "Task 1",
              description: "Test task 1",
              status: "pending" as const,
              dependencies: [],
              details: "",
              testStrategy: "",
              subtasks: [
                {
                  id: 1,
                  title: "Subtask 1.1",
                  description: "Test subtask 1.1",
                  status: "done" as const,
                  dependencies: [],
                  details: "",
                  testStrategy: "",
                },
              ],
            },
            {
              id: 2,
              title: "Task 2",
              description: "Test task 2",
              status: "in-progress" as const,
              dependencies: ["1"],
              details: "",
              testStrategy: "",
              subtasks: [],
            },
          ],
          isActive: true,
        },
        "feature-branch": {
          name: "feature-branch",
          tasks: [
            {
              id: 3,
              title: "Feature Task",
              description: "Feature task description",
              status: "pending" as const,
              dependencies: [],
              details: "",
              testStrategy: "",
              subtasks: [],
            },
          ],
          isActive: false,
        },
      },
      currentTag: "master",
      migrationVersion: "1.0.0",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    };

    it("should accept valid tasks file", () => {
      const result = TasksFileSchema.parse(validTasksFile);
      expect(result).toEqual(validTasksFile);
    });

    it("should apply default values", () => {
      const minimal = {};
      const result = TasksFileSchema.parse(minimal);

      expect(result.version).toBe("1.0.0");
      expect(result.currentTag).toBe("master");
      expect(result.tags.master.name).toBe("master");
      expect(result.tags.master.tasks).toEqual([]);
      expect(result.tags.master.isActive).toBe(true);
    });

    it("should validate currentTag exists in tags", () => {
      const invalidFile = {
        ...validTasksFile,
        currentTag: "non-existent-tag",
        tags: {
          master: validTasksFile.tags.master,
        },
      };

      expect(() => TasksFileSchema.parse(invalidFile)).toThrow(
        /Current tag 'non-existent-tag' must exist in tags/
      );
    });

    it("should validate at least one tag is active", () => {
      const invalidFile = {
        ...validTasksFile,
        tags: {
          master: {
            ...validTasksFile.tags.master,
            isActive: false,
          },
          "feature-branch": {
            ...validTasksFile.tags["feature-branch"],
            isActive: false,
          },
        },
      };

      expect(() => TasksFileSchema.parse(invalidFile)).toThrow(
        /At least one tag must be active/
      );
    });

    it("should validate only one tag is active", () => {
      const invalidFile = {
        ...validTasksFile,
        tags: {
          master: {
            ...validTasksFile.tags.master,
            isActive: true,
          },
          "feature-branch": {
            ...validTasksFile.tags["feature-branch"],
            isActive: true,
          },
        },
      };

      expect(() => TasksFileSchema.parse(invalidFile)).toThrow(
        /Only one tag can be active at a time/
      );
    });

    it("should validate no duplicate task IDs within a tag", () => {
      const invalidFile = {
        ...validTasksFile,
        tags: {
          master: {
            ...validTasksFile.tags.master,
            tasks: [
              validTasksFile.tags.master.tasks[0],
              {
                ...validTasksFile.tags.master.tasks[1],
                id: 1, // Duplicate ID
              },
            ],
          },
        },
      };

      expect(() => TasksFileSchema.parse(invalidFile)).toThrow(
        /Duplicate task ID 1 found in tag 'master'/
      );
    });

    it("should validate task dependencies exist", () => {
      const invalidFile = {
        ...validTasksFile,
        tags: {
          master: {
            ...validTasksFile.tags.master,
            tasks: [
              {
                id: 1,
                title: "Task 1",
                description: "Test task 1",
                status: "pending" as const,
                dependencies: ["999"], // Non-existent dependency
                details: "",
                testStrategy: "",
                subtasks: [],
              },
            ],
          },
        },
      };

      expect(() => TasksFileSchema.parse(invalidFile)).toThrow(
        /Task dependency '999' references a non-existent task/
      );
    });

    it("should validate subtask dependencies exist", () => {
      const invalidFile = {
        ...validTasksFile,
        tags: {
          master: {
            ...validTasksFile.tags.master,
            tasks: [
              {
                id: 1,
                title: "Task 1",
                description: "Test task 1",
                status: "pending" as const,
                dependencies: [],
                details: "",
                testStrategy: "",
                subtasks: [
                  {
                    id: 1,
                    title: "Subtask 1.1",
                    description: "Test subtask 1.1",
                    status: "pending" as const,
                    dependencies: ["999"], // Non-existent dependency
                    details: "",
                    testStrategy: "",
                  },
                ],
              },
            ],
          },
        },
      };

      expect(() => TasksFileSchema.parse(invalidFile)).toThrow(
        /Subtask dependency '999' references a non-existent task/
      );
    });

    it("should allow dependencies across tags", () => {
      const validCrossTagFile = {
        ...validTasksFile,
        tags: {
          master: {
            name: "master",
            tasks: [
              {
                id: 1,
                title: "Task 1",
                description: "Test task 1",
                status: "done" as const,
                dependencies: [],
                details: "",
                testStrategy: "",
                subtasks: [],
              },
            ],
            isActive: true,
          },
          "feature-branch": {
            name: "feature-branch",
            tasks: [
              {
                id: 2,
                title: "Feature Task",
                description: "Feature task description",
                status: "pending" as const,
                dependencies: ["1"], // Depends on task in master tag
                details: "",
                testStrategy: "",
                subtasks: [],
              },
            ],
            isActive: false,
          },
        },
      };

      const result = TasksFileSchema.parse(validCrossTagFile);
      expect(result.tags["feature-branch"].tasks[0].dependencies).toEqual([
        "1",
      ]);
    });

    it("should handle complex subtask dependencies", () => {
      const complexFile = {
        ...validTasksFile,
        tags: {
          master: {
            name: "master",
            tasks: [
              {
                id: 1,
                title: "Task 1",
                description: "Test task 1",
                status: "pending" as const,
                dependencies: [],
                details: "",
                testStrategy: "",
                subtasks: [
                  {
                    id: 1,
                    title: "Subtask 1.1",
                    description: "Test subtask 1.1",
                    status: "pending" as const,
                    dependencies: ["2"], // Depends on task 2
                    details: "",
                    testStrategy: "",
                  },
                ],
              },
              {
                id: 2,
                title: "Task 2",
                description: "Test task 2",
                status: "done" as const,
                dependencies: [],
                details: "",
                testStrategy: "",
                subtasks: [],
              },
            ],
            isActive: true,
          },
        },
      };

      const result = TasksFileSchema.parse(complexFile);
      expect(result.tags.master.tasks[0].subtasks[0].dependencies).toEqual([
        "2",
      ]);
    });

    it("should handle empty tags object", () => {
      const emptyTagsFile = {
        // Se não passarmos tags, o default será aplicado automaticamente
      };

      const result = TasksFileSchema.parse(emptyTagsFile);
      expect(result.tags.master).toBeDefined();
      expect(result.tags.master.name).toBe("master");
      expect(result.tags.master.isActive).toBe(true);
      expect(result.currentTag).toBe("master");
    });

    it("should handle optional fields", () => {
      const minimalFile = {
        tags: {
          master: {
            name: "master",
            tasks: [],
            isActive: true,
          },
        },
      };

      const result = TasksFileSchema.parse(minimalFile);
      expect(result.version).toBe("1.0.0");
      expect(result.currentTag).toBe("master");
      expect(result.projectMetadata).toBeUndefined();
      expect(result.migrationVersion).toBeUndefined();
      expect(result.createdAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
    });

    it("should accept valid datetime formats", () => {
      const withTimestamps = {
        ...validTasksFile,
        createdAt: "2024-01-01T10:30:45.123Z",
        updatedAt: "2024-01-02T15:45:30.456Z",
      };

      const result = TasksFileSchema.parse(withTimestamps);
      expect(result.createdAt).toBe("2024-01-01T10:30:45.123Z");
      expect(result.updatedAt).toBe("2024-01-02T15:45:30.456Z");
    });

    it("should reject invalid datetime formats", () => {
      const invalidTimestamps = {
        ...validTasksFile,
        createdAt: "invalid-date",
      };

      expect(() => TasksFileSchema.parse(invalidTimestamps)).toThrow();
    });
  });
});
