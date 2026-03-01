import TreeEditor from "../graph/TreeEditor";

export default function Home() {
  return (
    <div>
      <h1 style={{ margin: 0 }}>KnowledgeTrees</h1>
      <p style={{ color: "#555" }}>
        Connect handles to create prerequisite edges.
      </p>
      <TreeEditor />
    </div>
  );
}

/*
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

type Health = { status: string };

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/health"],
    queryFn: async () => {
      const res = await api.get<Health>("/api/v1/health");
      return res.data;
    }
  });

  return (
    <div>
      <h1 style={{ margin: 0 }}>Home</h1>
      <p style={{ color: "#555" }}>
        If you see <code>{"{status: ok}"}</code> below, frontend ↔ backend wiring works.
      </p>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>Error loading health check.</p>}
      {data && (
        <pre style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
*/
