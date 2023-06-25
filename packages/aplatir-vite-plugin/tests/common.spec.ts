import { test } from "@japa/runner";

test.group("aplatir-vite-plugin", (group) => {
  group.each.setup(async ({ context }) => {
    const { fs } = context;
    await fs.create("file.liquid", "<div>Hello world</div>");
    return () => fs.remove("file.liquid");
  });
  test("read rc file", async ({ fs, assert }) => {
    await fs.create(
      "/tmp/rc.json",
      JSON.stringify({
        foo: "bar",
      })
    );
  });
});
