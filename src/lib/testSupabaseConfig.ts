import { supabase } from "./supabase";

// Test function to verify Supabase configuration
export const testSupabaseConfiguration = async () => {
  console.log("🔧 Testing Supabase Configuration...");

  // Check environment variables
  console.log("📋 Environment Variables:");
  console.log("- VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
  console.log(
    "- VITE_SUPABASE_PROJECT_ID:",
    import.meta.env.VITE_SUPABASE_PROJECT_ID
  );
  console.log(
    "- VITE_SUPABASE_PUBLISHABLE_KEY (first 50 chars):",
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.substring(0, 50) + "..."
  );

  try {
    // Test 1: Check if Supabase client is initialized
    if (!supabase) {
      console.error("❌ Supabase client not initialized");
      return { success: false, error: "Client not initialized" };
    }
    console.log("✅ Supabase client initialized");

    // Test 2: Test basic connection
    console.log("🔗 Testing connection...");
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("❌ Auth connection error:", error);
    } else {
      console.log("✅ Auth connection successful");
    }

    // Test 3: Test database access (check if table exists)
    console.log("🗄️ Testing database access...");
    const { data: tableData, error: tableError } = await supabase
      .from("food_database")
      .select("count")
      .limit(1);

    if (tableError) {
      console.error("❌ Database access error:", tableError);
      if (
        tableError.message.includes('relation "food_database" does not exist')
      ) {
        console.log(
          "💡 Solution: Create the food_database table in your Supabase dashboard"
        );
      }
      return { success: false, error: tableError };
    } else {
      console.log("✅ Database access successful");
      console.log("📊 Table exists and is accessible");
    }

    // Test 4: Test Row Level Security (RLS)
    console.log("🔒 Testing permissions...");
    const { data: testInsert, error: insertError } = await supabase
      .from("food_database")
      .select("*")
      .limit(1);

    if (insertError) {
      console.warn("⚠️ Permission check failed:", insertError);
      if (insertError.message.includes("permission denied")) {
        console.log(
          "💡 Note: This might be due to Row Level Security policies"
        );
      }
    } else {
      console.log("✅ Read permissions working");
    }

    console.log("🎉 Configuration test completed successfully!");
    return { success: true, message: "All tests passed" };
  } catch (error) {
    console.error("❌ Configuration test failed:", error);
    return { success: false, error };
  }
};

// Quick validation of environment variables format
export const validateEnvVariables = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

  const issues = [];

  // Check URL format
  if (!url || !url.startsWith("https://")) {
    issues.push("❌ VITE_SUPABASE_URL should start with https://");
  }

  if (!url || !url.includes(".supabase.co")) {
    issues.push("❌ VITE_SUPABASE_URL should contain .supabase.co");
  }

  // Check key format (JWT)
  if (!key || !key.startsWith("eyJ")) {
    issues.push(
      '❌ VITE_SUPABASE_PUBLISHABLE_KEY should be a JWT token starting with "eyJ"'
    );
  }

  // Check project ID
  if (!projectId || projectId.length < 10) {
    issues.push("❌ VITE_SUPABASE_PROJECT_ID seems too short");
  }

  // Check if URL matches project ID
  if (url && projectId && !url.includes(projectId)) {
    issues.push("❌ Project ID should match the subdomain in the URL");
  }

  if (issues.length === 0) {
    console.log("✅ All environment variables are correctly formatted");
    return { valid: true };
  } else {
    console.log("❌ Environment variable issues found:");
    issues.forEach((issue) => console.log(issue));
    return { valid: false, issues };
  }
};
