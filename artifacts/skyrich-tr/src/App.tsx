import { Navbar } from "./components/layout/navbar";
import { Footer } from "./components/layout/footer";
import Home from "./pages/home";
import Products from "./pages/products";
import ProductDetail from "./pages/product-detail";
import BatteryFinder from "./pages/battery-finder";
import About from "./pages/about";
import Contact from "./pages/contact";
import AdminLogin from "./pages/admin/login";
import AdminPanel from "./pages/admin/panel";
import NotFound from "./pages/not-found";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "./components/error-boundary";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: any) => {
        if (error?.status === 401) {
          localStorage.removeItem("admin_token");
          window.location.href = "/admin";
        }
      },
    },
    queries: {
      retry: (failureCount: number, error: any) => {
        if (error?.status === 401) {
          localStorage.removeItem("admin_token");
          window.location.href = "/admin";
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      {children}
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Layout><Home /></Layout>
      </Route>
      <Route path="/urunler">
        <Layout><Products /></Layout>
      </Route>
      <Route path="/urunler/:id">
        <Layout><ProductDetail /></Layout>
      </Route>
      <Route path="/aku-bulucu">
        <Layout><BatteryFinder /></Layout>
      </Route>
      <Route path="/hakkimizda">
        <Layout><About /></Layout>
      </Route>
      <Route path="/iletisim">
        <Layout><Contact /></Layout>
      </Route>

      {/* Admin routes without standard Layout */}
      <Route path="/admin">
        <AdminLayout><AdminLogin /></AdminLayout>
      </Route>
      <Route path="/admin/panel">
        <AdminLayout><AdminPanel /></AdminLayout>
      </Route>

      <Route>
        <Layout><NotFound /></Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </ErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
