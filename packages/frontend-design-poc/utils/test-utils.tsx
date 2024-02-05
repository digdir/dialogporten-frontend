import { QueryClient, QueryClientProvider } from "react-query";
import { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { render, RenderOptions } from "@testing-library/react";

interface IExtendedRenderOptions extends RenderOptions {
  initialEntries?: string[];
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const customRender = (
  ui: ReactElement,
  options?: Omit<IExtendedRenderOptions, "wrapper">,
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={options?.initialEntries ?? ["/"]}>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
};
