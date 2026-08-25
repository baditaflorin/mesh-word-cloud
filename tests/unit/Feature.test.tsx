import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { createMockRoom } from "@baditaflorin/mesh-common/testing";
import { Feature } from "../../src/Feature";
import { config } from "../../src/config";

describe("Feature (component)", () => {
  it("renders the product opening when connected", () => {
    const room = createMockRoom();
    render(<Feature room={room} config={config} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("One word.Shared room.");
    expect(screen.getByRole("main", { name: "Room Words shared reflection" })).toBeInTheDocument();
    expect(screen.getByTestId("room-words")).toBeInTheDocument();
    expect(screen.getByText("Room live")).toBeInTheDocument();
  });

  it("shows a connecting state when room is null", () => {
    render(<Feature room={null} config={config} />);
    expect(screen.getByText("Joining room")).toBeInTheDocument();
    expect(screen.getByText("Preparing the shared room…")).toBeInTheDocument();
  });

  it("adds this peer's word to the cloud", () => {
    const room = createMockRoom({ peerId: "speaker" });
    render(<Feature room={room} config={config} />);

    fireEvent.change(screen.getByLabelText("Your one word"), {
      target: { value: "Hope" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Share word" }));

    expect(screen.getByText("hope")).toBeInTheDocument();
    expect(screen.getByText("1 word shared")).toBeInTheDocument();
    expect(screen.getByText("Your word “hope” is now in the shared cloud.")).toBeInTheDocument();
  });

  it("lets a prompt suggestion prepare the composer", () => {
    const room = createMockRoom({ peerId: "speaker" });
    render(<Feature room={room} config={config} />);

    fireEvent.click(screen.getByRole("button", { name: "curious" }));

    expect(screen.getByLabelText("Your one word")).toHaveValue("curious");
    expect(screen.getByRole("button", { name: "Share this word" })).toBeEnabled();
  });
});
