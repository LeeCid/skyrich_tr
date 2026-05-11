import { Navbar } from "./components/layout/navbar";
import { Footer } from "./components/layout/footer";
import Home from "./pages/home";
import Products from "./pages/products";
import ProductDetail from "./pages/product-detail";
import About from "./pages/about";
import Contact from "./pages/contact";
import AdminLogin from "./pages/admin/login";
import AdminPanel from "./pages/admin/panel";
import NotFound from "./pages/not-found";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

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
      <Route path="/hakkimizda">
        <Layout><About /></Layout>
      </Route>
      <Route path="/iletisim">
        <Layout><Contact /></Layout>
      </Route>
      
      {/* Admin routes without standard Layout */}
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/panel" component={AdminPanel} />
      
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
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
