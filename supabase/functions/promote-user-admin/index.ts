import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  email: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = (await req.json()) as RequestBody;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the service role key from environment
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceRoleKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY not found in environment");
    }

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      serviceRoleKey
    );

    console.log(`Promoting user ${email} to admin...`);

    // Get the user by email
    const { data: users, error: listError } = await supabase.auth.admin
      .listUsers();

    if (listError) throw listError;

    const user = users.users.find((u) => u.email === email);
    if (!user) {
      return new Response(
        JSON.stringify({ error: `User with email ${email} not found` }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Assign admin role
    const { error: roleError } = await supabase
      .from("user_roles")
      .upsert(
        {
          user_id: user.id,
          role: "admin",
        },
        { onConflict: "user_id,role" }
      );

    if (roleError) throw roleError;

    return new Response(
      JSON.stringify({
        success: true,
        message: `User ${email} promoted to admin successfully`,
        userId: user.id,
        email: user.email,
        role: "admin",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
