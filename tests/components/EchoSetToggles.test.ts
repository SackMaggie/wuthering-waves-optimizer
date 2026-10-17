import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import EchoSetToggles from "../../src/components/EchoSetToggles.vue";

const toggle = (container: Element, set: string) =>
  container.querySelector(`[data-test-echo-set-toggle="${set}"]`) as HTMLElement;

describe("EchoSetToggles", () => {
  it("shows every set at full colour while none is selected", () => {
    const { container } = render(EchoSetToggles, {
      props: { sets: ["FreezingFrost", "MoltenRift"], selected: [] },
    });
    for (const set of ["FreezingFrost", "MoltenRift"]) {
      expect(toggle(container, set).className).not.toContain("opacity-40");
      expect(toggle(container, set).className).not.toContain("border-primary");
    }
  });

  it("boxes the selected sets and greys out the rest", () => {
    const { container } = render(EchoSetToggles, {
      props: { sets: ["FreezingFrost", "MoltenRift", "VoidThunder"], selected: ["MoltenRift"] },
    });
    expect(toggle(container, "MoltenRift").className).toContain("border-primary");
    expect(toggle(container, "MoltenRift").getAttribute("aria-pressed")).toBe("true");
    expect(toggle(container, "FreezingFrost").className).toContain("opacity-40");
    expect(toggle(container, "VoidThunder").getAttribute("aria-pressed")).toBe("false");
  });

  it("reports which set was clicked", async () => {
    const { container, emitted } = render(EchoSetToggles, {
      props: { sets: ["FreezingFrost", "MoltenRift"], selected: [] },
    });
    await fireEvent.click(toggle(container, "MoltenRift"));
    expect(emitted().toggle).toEqual([["MoltenRift"]]);
  });
});
