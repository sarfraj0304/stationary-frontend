import { apiSlice } from "../../Redux/ApiSlice";

export const StationarySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    EmployeeGet: builder.query({
      query: () => {
        return {
          url: `get-user`,
        };
      },
      providesTags: ["employee-get"],
    }),
    CreateEmployee: builder.mutation({
      query: ({ url, method, body }) => {
        return {
          url: url,
          method: method,
          body: body ?? {},
        };
      },
      invalidatesTags: ["employee-get"],
    }),
    ItemsGet: builder.query({
      query: () => {
        return {
          url: `get-item`,
        };
      },
      providesTags: ["items-get"],
    }),
    CreateItems: builder.mutation({
      query: ({ url, method, body }) => {
        return {
          url: url,
          method: method,
          body: body ?? {},
        };
      },
      invalidatesTags: ["items-get"],
    }),
    UserItemsGet: builder.query({
      query: ({ url }) => {
        return {
          url: url,
        };
      },
      providesTags: ["user-items-get"],
      transformResponse: (data) => {
        return data?.data?.map((el) => ({
          ...el,
          ["name"]: el?.user?.name,
        }));
      },
    }),
    CreateUserItems: builder.mutation({
      query: ({ url, method, body }) => {
        return {
          url: url,
          method: method,
          body: body ?? {},
        };
      },
      invalidatesTags: ["user-items-get", "items-get"],
    }),
  }),
});

export const {
  useEmployeeGetQuery,
  useCreateEmployeeMutation,
  useItemsGetQuery,
  useCreateItemsMutation,
  useUserItemsGetQuery,
  useCreateUserItemsMutation,
} = StationarySlice;
