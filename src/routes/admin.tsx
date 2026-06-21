import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin • AL-QADAR FOODS POINT" },
      { name: "description", content: "Secure admin dashboard for AL-QADAR FOODS POINT." },
    ],
  }),
  beforeLoad: ({ location }) => {
    if (!ADMIN_SECRET || location.search?.secret !== ADMIN_SECRET) {
      throw redirect({ to: "/" });
    }
  },
  component: AdminPage,
});

type TableRow = Record<string, unknown>;

type AuthStatus = "loading" | "signed-out" | "signed-in";

function AdminPage() {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [orders, setOrders] = useState<TableRow[]>([]);
  const [requests, setRequests] = useState<TableRow[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    const client = getSupabaseClient();
    let mounted = true;

    async function initSession() {
      const { data, error: sessionError } = await client.auth.getSession();
      if (!mounted) return;
      if (sessionError) {
        setError(sessionError.message || "Unable to initialize session.");
        setStatus("signed-out");
        return;
      }
      if (data.session?.user) {
        setUser(data.session.user.email ?? data.session.user.id);
        setStatus("signed-in");
      } else {
        setStatus("signed-out");
      }
    }

    const { data: subscription } = client.auth.onAuthStateChange((_, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user.email ?? session.user.id);
        setStatus("signed-in");
        setError(null);
      } else {
        setUser(null);
        setStatus("signed-out");
      }
    });

    initSession();

    return () => {
      mounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (status !== "signed-in") return;
    fetchAdminData();
  }, [status]);

  async function fetchAdminData() {
    const client = getSupabaseClient();
    setDataError(null);

    try {
      const [ordersResult, requestsResult] = await Promise.all([
        client.from("orders").select("*").order("created_at", { ascending: false }).limit(30),
        client.from("catering_requests").select("*").order("created_at", { ascending: false }).limit(30),
      ]);

      if (ordersResult.error) {
        throw new Error(ordersResult.error.message);
      }
      if (requestsResult.error) {
        throw new Error(requestsResult.error.message);
      }

      setOrders(ordersResult.data ?? []);
      setRequests(requestsResult.data ?? []);
    } catch (fetchError) {
      setDataError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load admin data. Check Supabase tables and permissions.",
      );
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const client = getSupabaseClient();
      const { error: authError } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        setError(null);
      }
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    setError(null);
    try {
      const client = getSupabaseClient();
      await client.auth.signOut();
      setOrders([]);
      setRequests([]);
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : "Logout failed.");
    } finally {
      setLoading(false);
    }
  }

  const summary = useMemo(
    () => ({
      orders: orders.length,
      requests: requests.length,
    }),
    [orders.length, requests.length],
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
        <div className="mb-10 rounded-3xl border border-border bg-card/80 p-8 shadow-card backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Hidden admin portal</p>
              <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">AL-QADAR FOODS Admin</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Secure access for restaurant management. Log in with Supabase credentials to view orders, catering requests, and site control actions.
              </p>
            </div>
            <div className="rounded-3xl bg-background/80 px-5 py-4 text-sm text-foreground shadow-sm ring-1 ring-border">
              <p className="font-semibold">Route</p>
              <p className="mt-1 text-muted-foreground">/admin</p>
            </div>
          </div>
        </div>

        {status === "loading" ? (
          <div className="rounded-3xl border border-border bg-card/80 p-10 text-center text-sm text-muted-foreground shadow-card">
            Initializing secure session...
          </div>
        ) : status === "signed-out" ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <section className="rounded-3xl border border-border bg-card/80 p-8 shadow-card">
              <h2 className="text-2xl font-bold">Sign in</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Use the admin email and password assigned in Supabase.
              </p>
              <form className="mt-8 space-y-5" onSubmit={handleLogin}>
                <label className="grid gap-2 text-sm font-medium text-foreground">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-gold"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-foreground">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-gold"
                  />
                </label>
                {error ? <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p> : null}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </section>

            <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-card">
              <h3 className="text-lg font-semibold">Admin notes</h3>
              <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
                <li>Keep this URL private and do not link from the public site.</li>
                <li>Supabase auth protects this route with secure credentials.</li>
                <li>Orders and catering requests load from the Supabase tables.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
              <section className="rounded-3xl border border-border bg-card/80 p-8 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Welcome back, {user}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You are signed in to the hidden admin dashboard.
                    </p>
                  </div>
                  <Button variant="secondary" onClick={handleLogout} disabled={loading}>
                    {loading ? "Signing out..." : "Sign out"}
                  </Button>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-3xl bg-background/75 p-5 ring-1 ring-border">
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Orders</p>
                    <p className="mt-3 text-3xl font-bold text-gold">{summary.orders}</p>
                  </div>
                  <div className="rounded-3xl bg-background/75 p-5 ring-1 ring-border">
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Catering requests</p>
                    <p className="mt-3 text-3xl font-bold text-gold">{summary.requests}</p>
                  </div>
                  <div className="rounded-3xl bg-background/75 p-5 ring-1 ring-border">
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Last sync</p>
                    <p className="mt-3 text-3xl font-bold text-gold">Now</p>
                  </div>
                </div>
                {dataError ? (
                  <div className="mt-6 rounded-3xl bg-destructive/10 p-4 text-sm text-destructive">
                    {dataError}
                  </div>
                ) : null}
              </section>

              <section className="rounded-3xl border border-border bg-card/80 p-8 shadow-card">
                <h3 className="text-lg font-semibold">Admin access</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  This admin portal is intentionally hidden and only accessible via the direct URL.
                </p>
                <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <p>Use Supabase auth to manage access.</p>
                  <p>All data loading occurs securely from Supabase storage.</p>
                </div>
              </section>
            </div>

            <section className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-card">
                <h3 className="text-lg font-semibold">Recent orders</h3>
                {orders.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">No orders were found. Create an orders table in Supabase and sync data from the site.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {orders.map((row, index) => (
                      <div key={index} className="rounded-2xl border border-border bg-background p-4">
                        <p className="text-sm font-semibold">{String(row.id ?? `#${index + 1}`)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{String(row.created_at ?? "Unknown date")}</p>
                        <pre className="mt-3 overflow-x-auto text-xs text-muted-foreground">{JSON.stringify(row, null, 2)}</pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-card">
                <h3 className="text-lg font-semibold">Recent catering requests</h3>
                {requests.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">No catering requests were found yet.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {requests.map((row, index) => (
                      <div key={index} className="rounded-2xl border border-border bg-background p-4">
                        <p className="text-sm font-semibold">{String(row.id ?? `#${index + 1}`)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{String(row.created_at ?? "Unknown date")}</p>
                        <pre className="mt-3 overflow-x-auto text-xs text-muted-foreground">{JSON.stringify(row, null, 2)}</pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
