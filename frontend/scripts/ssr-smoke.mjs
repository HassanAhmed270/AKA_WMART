import { createServer } from "vite";

let vite;

try {
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");

  const home = await render("/");
  if (!home.html.includes("Premium Watches for Every Style")) {
    throw new Error('"/" did not render "Premium Watches for Every Style"');
  }

  const product = {
    _id: "abc123",
    productName: "Smoke Watch",
    productPrice: 1234,
    productImg: [{ url: "https://example.com/a.jpg", public_id: "x" }],
    productDescription: "Smoke description",
    category: "c",
    brand: "b",
    stock: 1,
  };

  const productPage = await render("/products/abc123", { products: [product] });
  if (!productPage.html.includes("Smoke Watch")) {
    throw new Error('"/products/abc123" did not render "Smoke Watch"');
  }
  if (!productPage.html.includes("1234")) {
    throw new Error('"/products/abc123" did not render "1234"');
  }

  console.log("SSR smoke test passed");
} catch (error) {
  console.error("SSR smoke test failed:", error);
  process.exitCode = 1;
} finally {
  if (vite) {
    await vite.close();
  }
}
