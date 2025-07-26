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
} from "../../../src/schemas/tasksSchema";
import { describe, expect, it } from "vitest";

describe("TasksSchema", () => {
  describe("StatusSchema", () => {
    it("should accept valid status values", () => {
      expect(StatusSchema.parse("done")).toBe("done");
      expect(StatusSchema.parse("in-progress")).toBe("in-progress");
      expect(StatusSchema.parse("pending")).toBe("pending");
      expect(StatusSchema.parse("blocked")).toBe("blocked");
    });

    it("should reject invalid status values", () => {
      expect(() => StatusSchema.parse("invalid")).toThrow();
      expect(() => StatusSchema.parse("complete")).toThrow();
      expect(() => StatusSchema.parse("")).toThrow();
    });
  });

  describe("PrioritySchema", () => {
    it("should accept valid priority values", () => {
      expect(PrioritySchema.parse("high")).toBe("high");
      expect(PrioritySchema.parse("medium")).toBe("medium");
      expect(PrioritySchema.parse("low")).toBe("low");
    });

    it("should reject invalid priority values", () => {
      expect(() => PrioritySchema.parse("critical")).toThrow();
      expect(() => PrioritySchema.parse("urgent")).toThrow();
      expect(() => PrioritySchema.parse("")).toThrow();
    });
  });

  describe("SubtaskIdSchema", () => {
    it("should accept valid subtask ID formats", () => {
      expect(SubtaskIdSchema.parse("1.1")).toBe("1.1");
      expect(SubtaskIdSchema.parse("2.3")).toBe("2.3");
      expect(SubtaskIdSchema.parse("10.25")).toBe("10.25");
    });

    it("should reject invalid subtask ID formats", () => {
      expect(() => SubtaskIdSchema.parse("1")).toThrow();
      expect(() => SubtaskIdSchema.parse("1.1.1")).toThrow();
      expect(() => SubtaskIdSchema.parse("a.1")).toThrow();
      expect(() => SubtaskIdSchema.parse("1.a")).toThrow();
      expect(() => SubtaskIdSchema.parse("")).toThrow();
    });
  });

  describe("TaskIdSchema", () => {
    it("should accept valid task ID formats", () => {
      expect(TaskIdSchema.parse("1")).toBe("1");
      expect(TaskIdSchema.parse("25")).toBe("25");
      expect(TaskIdSchema.parse("100")).toBe("100");
    });

    it("should reject invalid task ID formats", () => {
      expect(() => TaskIdSchema.parse("1.1")).toThrow();
      expect(() => TaskIdSchema.parse("a")).toThrow();
      expect(() => TaskIdSchema.parse("1a")).toThrow();
      expect(() => TaskIdSchema.parse("")).toThrow();
    });
  });

  describe("DependencySchema", () => {
    it("should accept both task and subtask IDs", () => {
      expect(DependencySchema.parse("1")).toBe("1");
      expect(DependencySchema.parse("1.1")).toBe("1.1");
      expect(DependencySchema.parse("25")).toBe("25");
      expect(DependencySchema.parse("10.3")).toBe("10.3");
    });

    it("should reject invalid dependency formats", () => {
      expect(() => DependencySchema.parse("a")).toThrow();
      expect(() => DependencySchema.parse("1.1.1")).toThrow();
      expect(() => DependencySchema.parse("")).toThrow();
    });
  });

  describe("SubtaskSchema", () => {
    const validSubtask = {
      id: 1,
      title: "Test Subtask",
      description: "Test description",
      status: "pending" as const,
      priority: "medium" as const,
      dependencies: [],
      details: "Test details",
      testStrategy: "Test strategy",
    };

    it("should accept valid subtask data", () => {
      const result = SubtaskSchema.parse(validSubtask);
      expect(result).toEqual(validSubtask);
    });

    it("should apply default values for optional fields", () => {
      const minimal = {
        id: 1,
        title: "Test",
        description: "Test desc",
        status: "pending" as const,
      };

      const result = SubtaskSchema.parse(minimal);
      expect(result.dependencies).toEqual([]);
      expect(result.details).toBe("");
      expect(result.testStrategy).toBe("");
    });

    it("should reject invalid subtask data", () => {
      expect(() => SubtaskSchema.parse({ ...validSubtask, id: -1 })).toThrow();
      expect(() =>
        SubtaskSchema.parse({ ...validSubtask, title: "" })
      ).toThrow();
      expect(() =>
        SubtaskSchema.parse({ ...validSubtask, description: "" })
      ).toThrow();
      expect(() =>
        SubtaskSchema.parse({ ...validSubtask, status: "invalid" })
      ).toThrow();
    });

    it("should accept valid dependencies", () => {
      const withDeps = {
        ...validSubtask,
        dependencies: ["1", "2.1", "3"],
      };

      const result = SubtaskSchema.parse(withDeps);
      expect(result.dependencies).toEqual(["1", "2.1", "3"]);
    });
  });

  describe("TaskSchema", () => {
    const validTask = {
      id: 1,
      title: "Test Task",
      description: "Test description",
      status: "pending" as const,
      priority: "high" as const,
      dependencies: [],
      details: "Test details",
      testStrategy: "Test strategy",
      subtasks: [],
    };

    const validSubtask = {
      id: 1,
      title: "Test Subtask",
      description: "Test subtask description",
      status: "pending" as const,
      dependencies: [],
      details: "",
      testStrategy: "",
    };

    it("should accept valid task data", () => {
      const result = TaskSchema.parse(validTask);
      expect(result).toEqual(validTask);
    });

    it("should accept task with valid subtasks", () => {
      const taskWithSubtasks = {
        ...validTask,
        subtasks: [validSubtask],
      };

      const result = TaskSchema.parse(taskWithSubtasks);
      expect(result.subtasks).toHaveLength(1);
      expect(result.subtasks[0]).toEqual(validSubtask);
    });

    it("should apply default values", () => {
      const minimal = {
        id: 1,
        title: "Test",
        description: "Test desc",
        status: "pending" as const,
      };

      const result = TaskSchema.parse(minimal);
      expect(result.dependencies).toEqual([]);
      expect(result.subtasks).toEqual([]);
      expect(result.details).toBe("");
      expect(result.testStrategy).toBe("");
    });

    it("should reject invalid task data", () => {
      expect(() => TaskSchema.parse({ ...validTask, id: 0 })).toThrow();
      expect(() => TaskSchema.parse({ ...validTask, title: "" })).toThrow();
      expect(() =>
        TaskSchema.parse({ ...validTask, description: "" })
      ).toThrow();
    });
  });

  describe("TagMetadataSchema", () => {
    it("should accept valid metadata", () => {
      const metadata = {
        description: "Test tag",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        author: "Test Author",
        version: "1.0.0",
      };

      const result = TagMetadataSchema.parse(metadata);
      expect(result).toEqual(metadata);
    });

    it("should accept empty metadata", () => {
      const result = TagMetadataSchema.parse({});
      expect(result).toEqual({});
    });

    it("should reject invalid datetime formats", () => {
      expect(() =>
        TagMetadataSchema.parse({ createdAt: "invalid-date" })
      ).toThrow();
      expect(() =>
        TagMetadataSchema.parse({ updatedAt: "2024-01-01" })
      ).toThrow();
    });
  });

  describe("TagSchema", () => {
    const validTag = {
      name: "test-tag",
      tasks: [],
      isActive: false,
    };

    const validTask = {
      id: 1,
      title: "Test Task",
      description: "Test description",
      status: "pending" as const,
      dependencies: [],
      details: "",
      testStrategy: "",
      subtasks: [],
    };

    it("should accept valid tag data", () => {
      const result = TagSchema.parse(validTag);
      expect(result).toEqual(validTag);
    });

    it("should accept tag with tasks", () => {
      const tagWithTasks = {
        ...validTag,
        tasks: [validTask],
      };

      const result = TagSchema.parse(tagWithTasks);
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0]).toEqual(validTask);
    });

    it("should apply default values", () => {
      const minimal = { name: "test" };
      const result = TagSchema.parse(minimal);
      expect(result.tasks).toEqual([]);
      expect(result.isActive).toBe(false);
    });

    it("should reject invalid tag names", () => {
      expect(() => TagSchema.parse({ name: "" })).toThrow();
      expect(() => TagSchema.parse({ name: "tag with spaces" })).toThrow();
      expect(() => TagSchema.parse({ name: "tag@special" })).toThrow();
      expect(() => TagSchema.parse({ name: "tag.dot" })).toThrow();
    });

    it("should accept valid tag names", () => {
      expect(TagSchema.parse({ name: "test" }).name).toBe("test");
      expect(TagSchema.parse({ name: "test-tag" }).name).toBe("test-tag");
      expect(TagSchema.parse({ name: "test_tag" }).name).toBe("test_tag");
      expect(TagSchema.parse({ name: "test123" }).name).toBe("test123");
    });
  });
});
