import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { localStorageAPI } from "./localStorage";

// Check if we're in production (GitHub Pages) or development
const isProduction = import.meta.env.PROD || window.location.hostname.includes('github.io');

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // For GitHub Pages deployment, use localStorage instead of API
  if (isProduction) {
    return handleLocalStorageRequest(method, url, data);
  }

  // Development mode - use actual API
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// Handle localStorage operations for production
async function handleLocalStorageRequest(
  method: string,
  url: string,
  data?: unknown | undefined
): Promise<Response> {
  // Initialize sample data on first load
  localStorageAPI.initializeSampleData();

  // Simulate API response structure
  const createResponse = (responseData: any, status = 200) => {
    const response = new Response(JSON.stringify(responseData), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
    return Promise.resolve(response);
  };

  try {
    if (url === "/api/contributors") {
      if (method === "GET") {
        const contributors = localStorageAPI.getContributors();
        return createResponse(contributors);
      } else if (method === "POST") {
        const requestData = data as { name: string };
        const newContributor = localStorageAPI.addContributor(requestData.name);
        return createResponse(newContributor);
      }
    } else if (url === "/api/contributors/count") {
      if (method === "GET") {
        const count = localStorageAPI.getCount();
        return createResponse({ count });
      }
    } else if (url.startsWith("/api/contributors/")) {
      const id = parseInt(url.split("/").pop() || "0");

      if (method === "DELETE") {
        const success = localStorageAPI.deleteContributor(id);
        if (!success) throw new Error("Contributor not found");
        return createResponse({ success: true });
      } else if (method === "PATCH") {
        const requestData = data as { name: string };
        const updated = localStorageAPI.updateContributor(id, requestData.name);
        if (!updated) throw new Error("Contributor not found");
        return createResponse(updated);
      }
    }

    throw new Error(`Unsupported operation: ${method} ${url}`);
  } catch (error) {
    const errorResponse = new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
    return Promise.resolve(errorResponse);
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 0, // Allow immediate refetching when invalidated
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
