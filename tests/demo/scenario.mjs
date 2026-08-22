export default async function wordCloudScenario(a, b) {
  await a.getByLabel("Your word").fill("warmth");
  await a.getByRole("button", { name: "Add word" }).click();
  await b.getByLabel("Your word").fill("clarity");
  await b.getByRole("button", { name: "Add word" }).click();
  await b.getByText("warmth").waitFor({ timeout: 10_000 });
  await a.waitForTimeout(1_200);
}
