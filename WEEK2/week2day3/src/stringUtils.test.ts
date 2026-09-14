import { capitalize, slugify } from "./stringUtils.js";

describe("UserInputTest", () => {
  describe("CapitalizeTest", () => {
    test("returns capital letter for single word", () => {
      const userName: string = capitalize("subodh");
      expect(userName).toBe("Subodh");
    });
    test("returns capital letter for single word with special characters", () => {
      const userName: string = capitalize("subodh-shah");
      expect(userName).toBe("Subodh-shah");
    });
    test("returns capital letter for multiple words", () => {
      const userName: string = capitalize("subodh shah");
      expect(userName).toBe("Subodh Shah");
    });
  });
  describe("SlugifyTest", () => {
    test("returns slugify string for two words", () => {
      const slugifyStr: string = slugify("Subodh Shah");
      expect(slugifyStr).toBe("subodh-shah");
    });
    test("returns slugify string for multiple words", () => {
      const slugifyStr: string = slugify(
        "Subodh Shah is programming right now",
      );
      expect(slugifyStr).toBe("subodh-shah-is-programming-right-now");
    });
  });
});
