import { apiRequest, ApiRequestOptions } from "./apiRequest";

export const clxRequest = {
  get<T = unknown>(
    url: string,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ): Promise<T> {
    return apiRequest<T>(url, { ...options, method: "GET" });
  },

  post<
    T = unknown,
    D extends Record<string, unknown> | unknown[] = Record<string, unknown>,
  >(
    url: string,
    data?: D,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ): Promise<T> {
    return apiRequest<T>(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<
    T = unknown,
    D extends Record<string, unknown> | unknown[] = Record<string, unknown>,
  >(
    url: string,
    data?: D,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ): Promise<T> {
    return apiRequest<T>(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete<T = unknown>(
    url: string,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ): Promise<T> {
    return apiRequest<T>(url, { ...options, method: "DELETE" });
  },

  patch<
    T = unknown,
    D extends Record<string, unknown> | unknown[] = Record<string, unknown>,
  >(
    url: string,
    data?: D,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ): Promise<T> {
    return apiRequest<T>(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  postForm<T = unknown>(
    url: string,
    formData: FormData,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ): Promise<T> {
    return apiRequest<T>(url, {
      ...options,
      method: "POST",
      body: formData,
    });
  },

  request: apiRequest,
};
