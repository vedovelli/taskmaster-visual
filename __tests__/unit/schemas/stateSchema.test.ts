import {
  AppConfigSchema,
  ProjectMetadataSchema,
  SessionStateSchema,
  StateSchema,
  UserPreferencesSchema,
} from "../../../src/schemas/stateSchema";
import { describe, expect, it } from "vitest";

describe("StateSchema", () => {
  describe("AppConfigSchema", () => {
    it("should accept valid app config", () => {
      const config = {
        theme: "dark" as const,
        language: "pt",
        autoSave: false,
        notifications: false,
        debugMode: true,
      };

      const result = AppConfigSchema.parse(config);
      expect(result).toEqual(config);
    });

    it("should apply default values", () => {
      const result = AppConfigSchema.parse({});
      expect(result.theme).toBe("system");
      expect(result.language).toBe("en");
      expect(result.autoSave).toBe(true);
      expect(result.notifications).toBe(true);
      expect(result.debugMode).toBe(false);
    });

    it("should reject invalid theme values", () => {
      expect(() => AppConfigSchema.parse({ theme: "blue" })).toThrow();
      expect(() => AppConfigSchema.parse({ theme: "auto" })).toThrow();
    });

    it("should accept valid theme values", () => {
      expect(AppConfigSchema.parse({ theme: "light" }).theme).toBe("light");
      expect(AppConfigSchema.parse({ theme: "dark" }).theme).toBe("dark");
      expect(AppConfigSchema.parse({ theme: "system" }).theme).toBe("system");
    });
  });

  describe("UserPreferencesSchema", () => {
    it("should accept valid user preferences", () => {
      const prefs = {
        defaultView: "kanban" as const,
        itemsPerPage: 50,
        showCompletedTasks: false,
        sortBy: "priority" as const,
        sortOrder: "desc" as const,
        groupBy: "status" as const,
      };

      const result = UserPreferencesSchema.parse(prefs);
      expect(result).toEqual(prefs);
    });

    it("should apply default values", () => {
      const result = UserPreferencesSchema.parse({});
      expect(result.defaultView).toBe("grid");
      expect(result.itemsPerPage).toBe(20);
      expect(result.showCompletedTasks).toBe(true);
      expect(result.sortBy).toBe("id");
      expect(result.sortOrder).toBe("asc");
      expect(result.groupBy).toBe("none");
    });

    it("should reject invalid view values", () => {
      expect(() =>
        UserPreferencesSchema.parse({ defaultView: "table" })
      ).toThrow();
      expect(() =>
        UserPreferencesSchema.parse({ defaultView: "card" })
      ).toThrow();
    });

    it("should reject invalid itemsPerPage values", () => {
      expect(() => UserPreferencesSchema.parse({ itemsPerPage: 4 })).toThrow();
      expect(() =>
        UserPreferencesSchema.parse({ itemsPerPage: 101 })
      ).toThrow();
      expect(() => UserPreferencesSchema.parse({ itemsPerPage: -1 })).toThrow();
    });

    it("should accept valid itemsPerPage range", () => {
      expect(
        UserPreferencesSchema.parse({ itemsPerPage: 5 }).itemsPerPage
      ).toBe(5);
      expect(
        UserPreferencesSchema.parse({ itemsPerPage: 50 }).itemsPerPage
      ).toBe(50);
      expect(
        UserPreferencesSchema.parse({ itemsPerPage: 100 }).itemsPerPage
      ).toBe(100);
    });

    it("should reject invalid sortBy values", () => {
      expect(() => UserPreferencesSchema.parse({ sortBy: "name" })).toThrow();
      expect(() => UserPreferencesSchema.parse({ sortBy: "date" })).toThrow();
    });

    it("should accept valid sortBy values", () => {
      expect(UserPreferencesSchema.parse({ sortBy: "id" }).sortBy).toBe("id");
      expect(UserPreferencesSchema.parse({ sortBy: "priority" }).sortBy).toBe(
        "priority"
      );
      expect(UserPreferencesSchema.parse({ sortBy: "status" }).sortBy).toBe(
        "status"
      );
      expect(UserPreferencesSchema.parse({ sortBy: "title" }).sortBy).toBe(
        "title"
      );
      expect(UserPreferencesSchema.parse({ sortBy: "createdAt" }).sortBy).toBe(
        "createdAt"
      );
    });
  });

  describe("SessionStateSchema", () => {
    it("should accept valid session state", () => {
      const session = {
        lastActiveTask: "3.2",
        lastActiveTag: "feature-branch",
        openTasks: ["1", "2", "3.1"],
        collapsedTasks: ["4", "5.1"],
        searchQuery: "implement auth",
        activeFilters: { status: "pending", priority: "high" },
      };

      const result = SessionStateSchema.parse(session);
      expect(result).toEqual(session);
    });

    it("should apply default values", () => {
      const result = SessionStateSchema.parse({});
      expect(result.lastActiveTag).toBe("master");
      expect(result.openTasks).toEqual([]);
      expect(result.collapsedTasks).toEqual([]);
      expect(result.searchQuery).toBe("");
      expect(result.activeFilters).toEqual({});
    });

    it("should handle optional lastActiveTask", () => {
      const result = SessionStateSchema.parse({});
      expect(result.lastActiveTask).toBeUndefined();

      const withTask = SessionStateSchema.parse({ lastActiveTask: "1.1" });
      expect(withTask.lastActiveTask).toBe("1.1");
    });
  });

  describe("ProjectMetadataSchema", () => {
    const validMetadata = {
      name: "Test Project",
      version: "2.0.0",
      description: "A test project",
      author: "Test Author",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
      tasksPath: "custom/tasks.json",
      configPath: "custom/config.json",
    };

    it("should accept valid project metadata", () => {
      const result = ProjectMetadataSchema.parse(validMetadata);
      expect(result).toEqual(validMetadata);
    });

    it("should apply default values", () => {
      const minimal = {
        name: "Test",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      const result = ProjectMetadataSchema.parse(minimal);
      expect(result.version).toBe("1.0.0");
      expect(result.tasksPath).toBe(".taskmaster/tasks/tasks.json");
      expect(result.configPath).toBe(".taskmaster/config.json");
    });

    it("should reject empty project name", () => {
      expect(() =>
        ProjectMetadataSchema.parse({
          name: "",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        })
      ).toThrow();
    });

    it("should reject invalid datetime formats", () => {
      expect(() =>
        ProjectMetadataSchema.parse({
          name: "Test",
          createdAt: "invalid-date",
          updatedAt: "2024-01-01T00:00:00.000Z",
        })
      ).toThrow();

      expect(() =>
        ProjectMetadataSchema.parse({
          name: "Test",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01",
        })
      ).toThrow();
    });
  });

  describe("StateSchema", () => {
    const validState = {
      currentTag: "master",
      lastSwitched: "2024-01-01T00:00:00.000Z",
      migrationNoticeShown: true,
      appConfig: {
        theme: "dark" as const,
        language: "en",
        autoSave: true,
        notifications: true,
        debugMode: false,
      },
      userPreferences: {
        defaultView: "grid" as const,
        itemsPerPage: 20,
        showCompletedTasks: true,
        sortBy: "id" as const,
        sortOrder: "asc" as const,
        groupBy: "none" as const,
      },
      sessionState: {
        lastActiveTag: "master",
        openTasks: [],
        collapsedTasks: [],
        searchQuery: "",
        activeFilters: {},
      },
      projectMetadata: {
        name: "Test Project",
        version: "1.0.0",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        tasksPath: ".taskmaster/tasks/tasks.json",
        configPath: ".taskmaster/config.json",
      },
      availableTags: ["master", "feature-branch"],
      version: "1.0.0",
    };

    it("should accept valid state", () => {
      const result = StateSchema.parse(validState);
      expect(result).toEqual(validState);
    });

    it("should apply default values", () => {
      const minimal = {
        projectMetadata: {
          name: "Test",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      };

      const result = StateSchema.parse(minimal);
      expect(result.currentTag).toBe("master");
      expect(result.migrationNoticeShown).toBe(false);
      expect(result.availableTags).toEqual(["master"]);
      expect(result.version).toBe("1.0.0");
    });

    it("should validate currentTag exists in availableTags", () => {
      const invalidState = {
        ...validState,
        currentTag: "non-existent",
        availableTags: ["master", "feature-branch"],
      };

      expect(() => StateSchema.parse(invalidState)).toThrow(
        /Current tag 'non-existent' must be in available tags/
      );
    });

    it("should validate lastActiveTag exists in availableTags", () => {
      const invalidState = {
        ...validState,
        sessionState: {
          ...validState.sessionState,
          lastActiveTag: "non-existent",
        },
        availableTags: ["master"],
      };

      expect(() => StateSchema.parse(invalidState)).toThrow(
        /Last active tag 'non-existent' must be in available tags/
      );
    });

    it("should validate timestamp consistency", () => {
      const invalidState = {
        ...validState,
        lastSwitched: "2024-01-02T00:00:00.000Z",
        projectMetadata: {
          ...validState.projectMetadata,
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      };

      expect(() => StateSchema.parse(invalidState)).toThrow(
        /Last switched time cannot be after project updated time/
      );
    });

    it("should accept when lastSwitched is undefined", () => {
      const stateWithoutLastSwitched = {
        ...validState,
        lastSwitched: undefined,
      };

      const result = StateSchema.parse(stateWithoutLastSwitched);
      expect(result.lastSwitched).toBeUndefined();
    });

    it("should accept when lastActiveTag is undefined", () => {
      const stateWithoutLastActiveTag = {
        ...validState,
        sessionState: {
          ...validState.sessionState,
          lastActiveTag: undefined,
        },
      };

      // Como lastActiveTag é undefined, deve usar o default 'master'
      const result = StateSchema.parse(stateWithoutLastActiveTag);
      expect(result.sessionState.lastActiveTag).toBe("master");
    });

    it("should handle nested default values", () => {
      const minimal = {
        projectMetadata: {
          name: "Test",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      };

      const result = StateSchema.parse(minimal);

      // Check appConfig defaults
      expect(result.appConfig.theme).toBe("system");
      expect(result.appConfig.language).toBe("en");

      // Check userPreferences defaults
      expect(result.userPreferences.defaultView).toBe("grid");
      expect(result.userPreferences.itemsPerPage).toBe(20);

      // Check sessionState defaults
      expect(result.sessionState.lastActiveTag).toBe("master");
      expect(result.sessionState.openTasks).toEqual([]);
    });
  });
});
