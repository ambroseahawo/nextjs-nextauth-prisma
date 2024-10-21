import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/`,
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (user) => ({
        url: "auth/signup",
        method: "POST",
        data: user,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/signin",
        method: "POST",
        data: credentials,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
