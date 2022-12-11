const { create } = await import("ipfs-core");
export async function ipfsClient(auth) {
  const client = await create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });
  console.log(client);
  return client;
}
