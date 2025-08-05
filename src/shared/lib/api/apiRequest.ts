export type ApiRequestOptions = RequestInit & {
  timeout?: number;
  authToken?: string;
  abortSignal?: AbortSignal;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { timeout, authToken, abortSignal, ...fetchOptions } = options;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
  const url = `${apiBaseUrl}${endpoint}`;

  // Create abort controller for timeout if needed
  const controller = new AbortController();
  const signal = abortSignal || controller.signal;

  // Set timeout if specified
  let timeoutId: NodeJS.Timeout | undefined;
  if (timeout) {
    timeoutId = setTimeout(() => controller.abort(), timeout);
  }

  try {
    // Create a Headers object instead of using HeadersInit directly
    const headers = new Headers(fetchOptions.headers);

    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }

    // Only set Content-Type if not FormData
    if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal,
    });

    console.log(response)
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const error: Error & { status?: number; data?: unknown } = new Error(
        `API request failed: ${response.statusText}`,
      );
      error.status = response.status;
      error.data = errorData;

      console.error(`API Error (${response.status}):`, {
        url,
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      });

      throw error;
    }

    // For 204 No Content responses, return null as T
    if (response.status === 204) {
      return null as unknown as T;
    }

    // Check content type before parsing as JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    // Return response for non-JSON content
    return response as unknown as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      const timeoutError: Error & { isTimeout?: boolean } = new Error(
        "Request timed out",
      );
      timeoutError.isTimeout = true;
      throw timeoutError;
    }
    console.error("API Request Error:", error);
    throw error;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
