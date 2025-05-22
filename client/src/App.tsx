
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Layout from "@/components/Layout";
import { useCountries, getCountryByIso } from "@/hooks/use-countries";

function CountryValidator({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: countries, isLoading, error } = useCountries();
  
  // Extract country code from path
  const countryCode = location.split("/")[1]?.toLowerCase();
  
  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <NotFound />;
  }
  
  // Check if country code is supported
  if (!countryCode || !getCountryByIso(countries, countryCode)) {
    return <NotFound />;
  }
  
  return <>{children}</>;
}

function Router() {
  const { data: countries } = useCountries();
  
  if (!countries?.length) {
    return null;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={() => (
          <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md max-w-md mx-auto mt-10">
            <h1 className="text-xl font-bold mb-2">Wrong configuration</h1>
            <p className="mb-4">Please specify a country code in the URL (e.g., /gh, /ng, etc.)</p>
            <p className="text-sm">Supported countries: {countries.map(c => c.countryIso2Code.toLowerCase()).join(', ')}</p>
          </div>
        )} />
        <Route path="/:country">
          {(params) => (
            <CountryValidator>
              <Home country={params.country} />
            </CountryValidator>
          )}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
